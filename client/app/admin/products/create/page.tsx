"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { usePostWithFiles } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
  const [file, setFile] = useState<File | null>(null);
   const router=useRouter();
  const [productData, setProductData] = useState({
    name: "",
    title: "",
    subTitle: "",
    description: "",
    buttonText: "",
    imageUrl: "", // preview url (string)
    gift: "",
    price: 0,
    offerPrice: 0,
    problem: "",
    problemSolving: "",
    solutions: [] as string[],
    eatProduct: "",
    useProduct: "",
    imageFiles: [] as File[], // review image files
    imagePreviews: [] as string[], // review image previews
    contactNumber: [] as string[],
    mainImageFile: null as File | null, // for the actual product image file
  });

  const { mutate: createProduct } = usePostWithFiles("/products/create", [
    "products",
  ]);
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

  const handleSolutionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedSolutions = [...productData.solutions];
    updatedSolutions[index] = e.target.value;
    setProductData({ ...productData, solutions: updatedSolutions });
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
  // Handle adding/removing contact numbers
  const handleContactNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedContactNumbers = [...productData.contactNumber];
    updatedContactNumbers[index] = e.target.value;
    setProductData({ ...productData, contactNumber: updatedContactNumbers });
  };

  // Handle adding a new contact number input
  const addContactNumber = () => {
    setProductData({
      ...productData,
      contactNumber: [...productData.contactNumber, ""],
    });
  };

  // Handle removing a contact number
  const removeContactNumber = (index: number) => {
    const updatedContactNumbers = productData.contactNumber.filter(
      (_, i) => i !== index
    );
    setProductData({ ...productData, contactNumber: updatedContactNumbers });
  };
  // Handle main image change: keep both preview url and real file
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      productData.imageUrl = URL.createObjectURL(selectedFile);
    }
  };

  // Handle review images change
  const handleReviewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => URL.createObjectURL(file));
    setProductData((prev) => ({
      ...prev,
      imageFiles: files, // real Files for reviews
      imagePreviews: previews, // preview urls for UI display
    }));
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
    // Append review images
    productData.imageFiles.forEach((file) => form.append("reviews", file));
    // solutions[]
    productData.solutions.forEach((solution, i) => {
      form.append(`solutions[${i}]`, solution);
    });
    // Append contact numbers
    productData.contactNumber.forEach((number, i) => {
      form.append(`contactNumber[${i}]`, number);
    });
    // Append main product image (ensure it's a file)
    if (file) {
      form.append("imageUrl", file!); // append the actual file, not the URL string
    }

    try {
      setIsLoading(true);
      await createProduct(form);
      toast.success("Product created successfully!");
      router.push("/admin/products");
      // Reset form
      setProductData({
        name: "",
        title: "",
        subTitle: "",
        description: "",
        buttonText: "",
        imageUrl: "",
        gift: "",
        price: 0,
        offerPrice: 0,
        problem: "",
        problemSolving: "",
        solutions: [],
        eatProduct: "",
        useProduct: "",
        imageFiles: [],
        imagePreviews: [],
        contactNumber: [],
        mainImageFile: null,
      });
      setFile(null);
      // Reset file input value
      const fileInput = document.getElementById("imageUrl") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            <option value="Halwa Mohabbot">Halwa Mohabbot</option>
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
        <div hidden={productData.name==="Halwa Mohabbot"}>
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
        <div hidden={productData.name==="Halwa Mohabbot"}>
          <label className="block">Product Description</label>
          <textarea
            value={productData.description}
            onChange={(e) => handleInputChange(e, "description")}
            className="w-full p-2 border rounded"
            placeholder="Enter product description"
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
            onChange={handleImageChange}
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
          <label className="block">উপহার ফ্রী</label>
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
          <label className="block">রেগুলার প্রাইজ</label>
          <input
            type="text"
            value={productData.price}
            onChange={(e) => handleInputChange(e, "price")}
            className="w-full p-2 border rounded"
            placeholder="Enter product price"
            required
          />
        </div>

        {/* Product Offer Price */}
        <div>
          <label className="block">অফার প্রাইজ</label>
          <input
            type="text"
            value={productData.offerPrice}
            onChange={(e) => handleInputChange(e, "offerPrice")}
            className="w-full p-2 border rounded"
            placeholder="Enter offer price"
          />
        </div>

        {/* Product Problem */}
        <div hidden={productData.name==="Halwa Mohabbot"}>
          <label className="block">সমস্যা</label>
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
          <label className="block">সমাধান টাইটেল</label>
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
          <label className="block">সমাধান আইটেমস</label>
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
                সমাধান রিমুভ করুন
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSolution}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            সমাধান এড করুন
          </button>
        </div>

        {/* Product Usage */}
        <div>
          <label className="block">খাবার নিয়ম</label>
          <input
            type="text"
            value={productData.eatProduct}
            onChange={(e) => handleInputChange(e, "eatProduct")}
            className="w-full p-2 border rounded"
            placeholder="Enter eat product details"
          />
        </div>

        <div hidden={productData.name === "Shefa Mixed"}>
          <label className="block">ব্যাবহারের নিয়ম</label>
          <input
            type="text"
            value={productData.useProduct}
            onChange={(e) => handleInputChange(e, "useProduct")}
            className="w-full p-2 border rounded"
            placeholder="Enter use product details"
          />
        </div>
        {/* Contact Numbers */}
        <div>
          <label className="block">Contact Numbers</label>
          {productData.contactNumber.map((contact, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={contact}
                onChange={(e) => handleContactNumberChange(e, index)}
                className="w-full p-2 border rounded"
                placeholder={`Contact Number ${index + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => removeContactNumber(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addContactNumber}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Contact Number
          </button>
        </div>
        {/* Product Reviews (Multiple Image Upload) */}
        <div className=" space-y-4">
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
                    setProductData({
                      ...productData,
                      imageFiles: newFiles,
                      imagePreviews: newPreviews,
                    });
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
