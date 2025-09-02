"use client";

import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { usePost, usePostWithFiles } from "@/hooks/useApi";
import { IProduct } from "@/types"; // Assuming IProduct is defined correctly
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

export default function CreateProductPage() {
  const [productData, setProductData] = useState({
    name: "",
    title: "a",
    subTitle: "a",
    description: "a",
    buttonText: "a",
    imageUrl: "", // preview url (string)
    gift: "a",
    price: 20,
    offerPrice: 10,
    problem: "a",
    problemSolving: "a",
    solutions: [] as string[],
    eatProduct: "a",
    useProduct: "a",
    imageFiles: [] as File[], // review image files
    imagePreviews: [] as string[], // review image previews
    contactNumber: [] as string[],
    // ✅ added: real file for main product image
    mainImageFile: null as File | null,
  });

  const { mutate: createProduct } = usePost("/products/create", ["products"]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change for product fields
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: string
  ) => {
    const { value } = e.target;
    setProductData({ ...productData, [field]: value });
  };

  const updateField = <K extends keyof typeof productData>(
    key: K,
    value: (typeof productData)[K]
  ) => {
    setProductData((prev) => ({ ...prev, [key]: value }));
  };

  // Handle adding/removing solutions
  const addSolution = () => {
    setProductData({
      ...productData,
      solutions: [...productData.solutions, ""],
    });
  };

  const removeSolution = (index: number) => {
    const updatedSolutions = productData.solutions.filter(
      (_, i) => i !== index
    );
    setProductData({ ...productData, solutions: updatedSolutions });
  };

  const handleSolutionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedSolutions = [...productData.solutions];
    updatedSolutions[index] = e.target.value;
    setProductData({ ...productData, solutions: updatedSolutions });
  };

  // Handle product form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productData.title || !productData.name || !productData.price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const form = new FormData();
    form.append("name", productData.name);
    form.append("title", productData.title);
    form.append("subTitle", productData.subTitle);
    form.append("description", productData.description);
    form.append("buttonText", productData.buttonText);
    form.append("gift", productData.gift);
    form.append("price", String(productData.price));
    form.append("offerPrice", String(productData.offerPrice));
    form.append("problem", productData.problem);
    form.append("problemSolving", productData.problemSolving);
    form.append("eatProduct", productData.eatProduct);
    form.append("useProduct", productData.useProduct);

    // solutions[]
    productData.solutions.forEach((solution, i) => {
      form.append(`solutions[${i}]`, solution);
    });
    form.append("imageUrl", productData.imageUrl as unknown as Blob);

    productData.imageFiles.forEach((file) => {
      form.append("reviews", file);
    });
    // ✅ main product image as real File
    // if (productData.mainImageFile) {
    //   form.append("imageUrl", productData.mainImageFile);
    // }

    // // reviews[] as files (only once)
    // productData.imageFiles.forEach((file) => {
    //   form.append("reviews", file);
    // });

    try {
      setIsLoading(true);
      console.log([...form]);
      await createProduct(form);
      toast.success("Product created successfully!");
    } catch (error) {
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle main image change: keep both preview url and real file
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setProductData({ ...productData, [field]: file }); // Store the file object for imageUrl }
    }
  };

  // Handle review images change
  const handleReviewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => URL.createObjectURL(file));
    setProductData((prev) => ({
      ...prev,
      imageFiles: files, // real Files for reviews
      imagePreviews: previews, // preview urls for UI
    }));
  };

  // (kept as requested) — make it a safe wrapper instead of throwing
  function handleSolutionChangeWrapper(
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ): void {
    handleSolutionChange(e, index);
  }

  return (
    <div className="space-y-6 w-full p-4">
      <h2 className="text-xl font-semibold">Create a Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name Dropdown */}
        <div>
          <label className="block">Product Name</label>
          <select
            value={productData.name}
            onChange={(e) => handleInputChange(e, "name")}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Product Name</option>
            <option value="Haluwa">Haluwa</option>
            <option value="Shefa Mixed">Shefa Mixed</option>
            <option value="Tin Neyamot">Tin Neyamot</option>
          </select>
        </div>

        {/* Product Title */}
        <div>
          <label className="block">Product Title</label>
          <input
            type="text"
            value={productData.title}
            onChange={(e) => handleInputChange(e, "title")}
            className="w-full p-2 border rounded"
            placeholder="Enter product title"
            required
          />
        </div>

        {/* Product SubTitle */}
        <div>
          <label className="block">Product SubTitle</label>
          <input
            type="text"
            value={productData.subTitle}
            onChange={(e) => handleInputChange(e, "subTitle")}
            className="w-full p-2 border rounded"
            placeholder="Enter product subtitle"
          />
        </div>

        {/* Product Description */}
        <div>
          <label className="block">Product Description</label>
          <textarea
            value={productData.description}
            onChange={(e) => handleInputChange(e, "description")}
            className="w-full p-2 border rounded"
            placeholder="Enter product description"
            required
          />
        </div>

        {/* Product Button Text */}
        <div>
          <label className="block">Button Text</label>
          <input
            type="text"
            value={productData.buttonText}
            onChange={(e) => handleInputChange(e, "buttonText")}
            className="w-full p-2 border rounded"
            placeholder="Enter button text"
          />
        </div>

        {/* Product Image (Image Upload) */}
        <div>
          <label className="block">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "imageUrl")}
            className="w-full p-2 border rounded"
            id="imageUrl"
          />

          {productData.imageUrl && (
            <img
              src={productData.imageUrl} // preview string
              alt="Product"
              className="mt-2 max-w-xs"
            />
          )}
        </div>

        {/* Product Gift */}
        <div>
          <label className="block">Gift</label>
          <input
            type="text"
            value={productData.gift}
            onChange={(e) => handleInputChange(e, "gift")}
            className="w-full p-2 border rounded"
            placeholder="Enter gift details"
          />
        </div>

        {/* Product Price */}
        <div>
          <label className="block">Price</label>
          <input
            type="number"
            value={productData.price}
            onChange={(e) => handleInputChange(e, "price")}
            className="w-full p-2 border rounded"
            placeholder="Enter product price"
            required
          />
        </div>

        {/* Product Offer Price */}
        <div>
          <label className="block">Offer Price</label>
          <input
            type="number"
            value={productData.offerPrice}
            onChange={(e) => handleInputChange(e, "offerPrice")}
            className="w-full p-2 border rounded"
            placeholder="Enter offer price"
          />
        </div>

        {/* Product Problem */}
        <div>
          <label className="block">Problem</label>
          <input
            type="text"
            value={productData.problem}
            onChange={(e) => handleInputChange(e, "problem")}
            className="w-full p-2 border rounded"
            placeholder="Enter product problem"
          />
        </div>

        {/* Product Problem Solving */}
        <div>
          <label className="block">Problem Solving</label>
          <input
            type="text"
            value={productData.problemSolving}
            onChange={(e) => handleInputChange(e, "problemSolving")}
            className="w-full p-2 border rounded"
            placeholder="Enter problem solving details"
          />
        </div>

        {/* Solutions */}
        <div>
          <label className="block">Solutions</label>
          {productData.solutions.map((solution, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={solution}
                onChange={(e) => handleSolutionChange(e, index)}
                className="p-2 border rounded w-full"
                placeholder={`Solution ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeSolution(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSolution}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Add Solution
          </button>
        </div>

        {/* Product Usage */}
        <div>
          <label className="block">Eat Product</label>
          <input
            type="text"
            value={productData.eatProduct}
            onChange={(e) => handleInputChange(e, "eatProduct")}
            className="w-full p-2 border rounded"
            placeholder="Enter eat product details"
          />
        </div>

        <div>
          <label className="block">Use Product</label>
          <input
            type="text"
            value={productData.useProduct}
            onChange={(e) => handleInputChange(e, "useProduct")}
            className="w-full p-2 border rounded"
            placeholder="Enter use product details"
          />
        </div>

        {/* Product Reviews (Multiple Image Upload) */}
        <div className="p-4 space-y-4">
          <label>Review Images</label>
          <div className="grid grid-cols-2 gap-2">
            {productData.imagePreviews.map((src, idx) => (
              <div
                key={idx}
                className="relative aspect-video bg-muted rounded-md overflow-hidden"
              >
                <img
                  src={src}
                  alt={`preview-${idx}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    const newFiles = [...productData.imageFiles];
                    const newPreviews = [...productData.imagePreviews];
                    newFiles.splice(idx, 1);
                    newPreviews.splice(idx, 1);
                    updateField("imageFiles", newFiles);
                    updateField("imagePreviews", newPreviews);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full" asChild>
            <label>
              <Upload className="mr-2 h-4 w-4" /> Upload Images
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleReviewImagesChange}
              />
            </label>
          </Button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
