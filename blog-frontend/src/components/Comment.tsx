
import React from "react";

interface CommentProps {
  authorId: string;
  content: string;
  createdAt: string;  
}

export const Comment = ({ authorId, content, createdAt }: CommentProps) => (
  <div className="border rounded p-2 my-2">
    <p className="font-semibold">{authorId}</p>
    <p>{content}</p>
    <span className="text-xs text-gray-500">{createdAt}</span>
  </div>
);

