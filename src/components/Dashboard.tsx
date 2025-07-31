"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, Download, LogOut, User } from "lucide-react";
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `uploads/${user.uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log("File uploaded successfully:", downloadURL);
      alert("File uploaded successfully!");

      // Reset input
      event.target.value = "";

      // Refresh file list
      loadFiles();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    }
    setUploading(false);
  };

  const loadFiles = async () => {
    if (!user) return;

    setLoadingFiles(true);
    try {
      const storageRef = ref(storage, `uploads/${user.uid}/`);
      const result = await listAll(storageRef);

      const fileURLs = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return url;
        })
      );

      setFiles(fileURLs);
    } catch (error) {
      console.error("Failed to load files:", error);
    }
    setLoadingFiles(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.displayName || user?.email}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Display Name:</strong> {user?.displayName || "Not set"}
              </p>
              <p>
                <strong>Phone Number:</strong> {user?.phoneNumber || "Not set"}
              </p>
              <p>
                <strong>User ID:</strong> {user?.uid}
              </p>
              <p>
                <strong>Email Verified:</strong>{" "}
                {user?.emailVerified ? "Yes" : "No"}
              </p>
              <p>
                <strong>Provider:</strong>{" "}
                {user?.providerData
                  .map((provider) => provider.providerId)
                  .join(", ") || "Unknown"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* File Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              File Upload
            </CardTitle>
            <CardDescription>
              Upload files to Firebase Storage. Files will be stored in your
              personal folder.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
              {uploading && <p className="text-blue-600">Uploading...</p>}
            </div>
          </CardContent>
        </Card>

        {/* Files List Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Your Files
              </div>
              <Button onClick={loadFiles} disabled={loadingFiles} size="sm">
                {loadingFiles ? "Loading..." : "Refresh"}
              </Button>
            </CardTitle>
            <CardDescription>
              Files uploaded to your personal storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No files uploaded yet. Upload a file to get started!
              </p>
            ) : (
              <div className="space-y-2">
                {files.map((fileURL, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <span className="text-sm truncate flex-1">
                      {decodeURIComponent(
                        fileURL.split("/").pop()?.split("?")[0] ||
                          "Unknown file"
                      )}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(fileURL, "_blank")}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
