"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApi, useDelete } from "@/hooks/useApi";
import toast from "react-hot-toast";
import Link from "next/link";
import { IProduct } from "@/types";

export default function QuizTable() {
  const [quizzes, setQuizzes] = useState<IProduct[]>([]);
  const { data, isLoading, refetch } = useApi<IProduct[]>(
    ["products"],
    "/products"
  );
  const { mutate: deleteSingleQuiz } = useDelete(
    (id) => `/products/${id}`,
    ["products"]
  );

  useEffect(() => {
    if (data) {
      setQuizzes(data);
    }
  }, [data]);

  const handleDelete = async (id: string) => {
    console.log("Deleting quiz with id:", id);
    try {
      await deleteSingleQuiz(id);
      toast.success("Quiz deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Error deleting quiz");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/create">Create New Product</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Passing Score</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizzes.map((quiz) => (
            <TableRow key={quiz._id}>
              <TableCell>{quiz.title}</TableCell>
              <TableCell>{quiz.description}</TableCell>
              <TableCell>{quiz.name}</TableCell>
              <TableCell>{quiz.price}</TableCell>
              <TableCell>{quiz.problem}</TableCell>

              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(quiz._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
