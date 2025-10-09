import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { MessageSquare, Send } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  user_name?: string;
}

interface PostCommentsProps {
  postId: string;
}

export const PostComments = ({ postId }: PostCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, postId]);

  const fetchComments = async () => {
    try {
      const { data: commentsData, error: commentsError } = await supabase
        .from("post_comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (commentsError) throw commentsError;

      // Fetch user profiles for comments
      const userIds = [...new Set(commentsData?.map(c => c.user_id) || [])];
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("user_profiles")
          .select("id, full_name")
          .in("id", userIds);

        const profilesMap: Record<string, string> = {};
        profilesData?.forEach(p => {
          profilesMap[p.id] = p.full_name || "Anonymous";
        });

        setComments(
          commentsData?.map(c => ({
            ...c,
            user_name: profilesMap[c.user_id]
          })) || []
        );
      } else {
        setComments(commentsData || []);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("post_comments").insert({
        post_id: postId,
        user_id: user.id,
        content: newComment.trim()
      });

      if (error) throw error;

      setNewComment("");
      toast.success("Comment added!");
      fetchComments();
    } catch (error) {
      toast.error("Failed to add comment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowComments(!showComments)}
        className="mb-3"
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
      </Button>

      {showComments && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex gap-2">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={2}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleSubmitComment}
              disabled={loading || !newComment.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {comments.map((comment) => (
              <Card key={comment.id} className="p-3 animate-scale-in">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {comment.user_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {comment.user_name || "Anonymous"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mt-1">{comment.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
