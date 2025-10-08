import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Heart, MessageSquare, Plus, User } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  created_at: string;
  user_id: string;
}

interface UserProfile {
  id: string;
  full_name: string | null;
}

const CommunityHub = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
  });

  useEffect(() => {
    checkAuth();
    fetchPosts();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setCurrentUserId(user.id);
  };

  const fetchPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;
      setPosts(postsData || []);

      // Fetch user profiles
      const userIds = [...new Set(postsData?.map(p => p.user_id) || [])];
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from("user_profiles")
          .select("id, full_name")
          .in("id", userIds);

        if (profilesError) throw profilesError;

        const profilesMap: Record<string, string> = {};
        profilesData?.forEach(p => {
          profilesMap[p.id] = p.full_name || "Anonymous";
        });
        setProfiles(profilesMap);
      }
    } catch (error: any) {
      toast.error("Failed to fetch community posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("community_posts").insert({
        title: newPost.title,
        content: newPost.content,
        category: newPost.category || "General",
        user_id: user.id,
      });

      if (error) throw error;

      toast.success("Post created successfully!");
      setNewPost({ title: "", content: "", category: "" });
      setIsDialogOpen(false);
      fetchPosts();
    } catch (error: any) {
      toast.error("Failed to create post");
      console.error(error);
    }
  };

  const handleLike = async (postId: string, currentLikes: number) => {
    try {
      const { error } = await supabase
        .from("community_posts")
        .update({ likes: currentLikes + 1 })
        .eq("id", postId);

      if (error) throw error;

      setPosts(posts.map(post =>
        post.id === postId ? { ...post, likes: currentLikes + 1 } : post
      ));
    } catch (error: any) {
      toast.error("Failed to like post");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Community Hub</h1>
              <p className="text-muted-foreground mt-2">
                Share knowledge and learn from fellow farmers
              </p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Post</DialogTitle>
                <DialogDescription>
                  Share your farming tips and experiences with the community
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Post title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Soil Health, Crop Rotation"
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts..."
                    rows={6}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreatePost} className="w-full">
                  Create Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-5/6 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold text-foreground">No posts yet</p>
              <p className="text-muted-foreground mt-2">
                Be the first to share your farming knowledge!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <User className="h-4 w-4" />
                        {profiles[post.user_id] || "Anonymous"}
                        <span className="mx-2">•</span>
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </CardDescription>
                    </div>
                    {post.category && (
                      <Badge variant="outline">{post.category}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap mb-4">{post.content}</p>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id, post.likes)}
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {post.likes}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityHub;
