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
import { PostComments } from "@/components/PostComments";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-purple/5 to-background">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/dashboard")}
              className="hover:bg-primary/10 hover:scale-110 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple to-primary bg-clip-text text-transparent">Community Hub</h1>
              <p className="text-lg text-muted-foreground mt-2">
                Share knowledge and learn from fellow farmers
              </p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple to-primary hover:from-purple/90 hover:to-primary/90 text-white shadow-medium hover:shadow-strong hover:scale-110 transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="border-2 border-purple/20">
              <DialogHeader>
                <DialogTitle className="text-2xl bg-gradient-to-r from-purple to-primary bg-clip-text text-transparent">Create a New Post</DialogTitle>
                <DialogDescription className="text-base">
                  Share your farming tips and experiences with the community
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title" className="text-base font-semibold">Title</Label>
                  <Input
                    id="title"
                    placeholder="Post title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="h-12 border-2 focus:border-purple transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-base font-semibold">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Soil Health, Crop Rotation"
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="h-12 border-2 focus:border-purple transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="content" className="text-base font-semibold">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts..."
                    rows={6}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="border-2 focus:border-purple transition-colors"
                  />
                </div>
                <Button 
                  onClick={handleCreatePost} 
                  className="w-full h-12 bg-gradient-to-r from-purple to-primary hover:from-purple/90 hover:to-primary/90 text-white shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-300"
                >
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
          <Card className="border-2 border-purple/20">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 rounded-full bg-gradient-to-br from-purple/20 to-primary/20 mb-6">
                <MessageSquare className="h-16 w-16 text-purple" />
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple to-primary bg-clip-text text-transparent">No posts yet</p>
              <p className="text-lg text-muted-foreground mt-3">
                Be the first to share your farming knowledge!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <Card 
                key={post.id} 
                className="hover:shadow-strong transition-all duration-300 animate-fade-in-up border-2 border-purple/10 hover:border-purple/30 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl bg-gradient-to-r from-purple to-primary bg-clip-text text-transparent">{post.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-3 text-base">
                        <div className="p-1.5 rounded-lg bg-purple/20">
                          <User className="h-4 w-4 text-purple" />
                        </div>
                        <span className="font-semibold">{profiles[post.user_id] || "Anonymous"}</span>
                        <span className="mx-2 text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </CardDescription>
                    </div>
                    {post.category && (
                      <Badge 
                        variant="outline" 
                        className="bg-gradient-to-r from-purple/10 to-primary/10 border-purple/30 text-purple font-semibold"
                      >
                        {post.category}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap mb-6 leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-4 border-t-2 border-border pt-5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id, post.likes)}
                      className="hover:text-destructive transition-colors hover:scale-110"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {post.likes}
                    </Button>
                  </div>
                  <PostComments postId={post.id} />
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
