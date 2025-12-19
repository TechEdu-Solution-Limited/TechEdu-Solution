"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Plus, Edit, Trash2, Search } from "lucide-react";

export default function FAQsPage() {
  const [faqs, setFaqs] = useState([
    {
      id: "1",
      question: "How do I update my profile information?",
      answer: "Go to your profile page and click the edit button to modify your information.",
      category: "account",
    },
    {
      id: "2",
      question: "How can I change my password?",
      answer: "Visit the Settings page and use the 'Change Password' section to update your password.",
      category: "account",
    },
    {
      id: "3",
      question: "How do I contact support?",
      answer: "You can reach our support team through email, phone, or whatsapp.",
      category: "contact",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general",
  });

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    if (formData.question && formData.answer) {
      setFaqs([
        ...faqs,
        {
          id: Date.now().toString(),
          ...formData,
        },
      ]);
      setFormData({ question: "", answer: "", category: "general" });
      setIsAdding(false);
    }
  };

  const handleEdit = (id: string) => {
    const faq = faqs.find((f) => f.id === id);
    if (faq) {
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
      });
      setEditingId(id);
      setIsAdding(false);
    }
  };

  const handleUpdate = () => {
    if (editingId && formData.question && formData.answer) {
      setFaqs(
        faqs.map((faq) =>
          faq.id === editingId
            ? { ...faq, ...formData }
            : faq
        )
      );
      setFormData({ question: "", answer: "", category: "general" });
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      setFaqs(faqs.filter((faq) => faq.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData({ question: "", answer: "", category: "general" });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-6 w-6" />
          <h1 className="text-2xl font-bold">FAQ Management</h1>
        </div>
        <Button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({ question: "", answer: "", category: "general" });
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search FAQs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit FAQ" : "Add New FAQ"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Question</label>
              <Input
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                placeholder="Enter question..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Answer</label>
              <Textarea
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                placeholder="Enter answer..."
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="e.g., account, contact, general"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={editingId ? handleUpdate : handleAdd}
                disabled={!formData.question || !formData.answer}
              >
                {editingId ? "Update" : "Add"} FAQ
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              {searchQuery
                ? "No FAQs found matching your search."
                : "No FAQs available. Add your first FAQ above."}
            </CardContent>
          </Card>
        ) : (
          filteredFAQs.map((faq) => (
            <Card key={faq.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{faq.question}</CardTitle>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {faq.category}
                    </span>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(faq.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(faq.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
