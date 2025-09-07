"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useApi,
  usePatchForProductWithFiles,
  usePatchWithFiles,
  usePostWithFiles,
} from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { IProduct } from "@/types";
import { getImageUrl } from "@/hooks/useGetImage";

export default function EditProductPage() {
  const { id } = useParams();
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
    price: "",
    offerPrice: "",
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
  const {
    data,
    isLoading: prodLoad,
    refetch,
  } = useApi<IProduct>(["products", id], `/products/${id}`, !!id);
  const { mutate: updateProduct } = usePatchForProductWithFiles(
    (id) => `/products/${id}`,
    ["products"]
  );

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
    // Check if id is available
    if (!id) {
      toast.error("Product ID is missing or invalid.");
      return; // Prevent form submission if id is undefined
    }
    if (!productData.title || !productData.name || !productData.price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("title", productData.title);
    formData.append("subTitle", productData.subTitle);
    formData.append("description", productData.description);
    formData.append("buttonText", productData.buttonText);
    formData.append("gift", productData.gift);
    formData.append("price", String(productData.price));
    formData.append("offerPrice", String(productData.offerPrice));
    formData.append("problem", productData.problem);
    formData.append("problemSolving", productData.problemSolving);
    formData.append("eatProduct", productData.eatProduct);
    formData.append("useProduct", productData.useProduct);
    // Append review images
    productData.imageFiles.forEach((file) => formData.append("reviews", file));
    // solutions[]
    productData.solutions.forEach((solution, i) => {
      formData.append(`solutions[${i}]`, solution);
    });
    // Append contact numbers
    productData.contactNumber.forEach((number, i) => {
      formData.append(`contactNumber[${i}]`, number);
    });
    // Append main product image (ensure it's a file)
    if (file) {
      formData.append("imageUrl", file!); // append the actual file, not the URL string
    }

    try {
      setIsLoading(true);
      await updateProduct({ id, data: formData });
       router.push("/admin/products");
    } catch (error) {
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      toast.error("Product ID is missing.");
      return; // Prevent further execution if the ID is missing
    }
    if (id) {
      const fetchProductDetails = async () => {
        try {
          await refetch(); // This triggers the API call to fetch product details.
          if (data) {
            // Set product data from API response
            setProductData({
              name: data.name,
              title: data.title,
              subTitle: data.subTitle,
              description: data.description,
              buttonText: data.buttonText,
              imageUrl: data.imageUrl,
              gift: data.gift,
              price: data.price,
              offerPrice: data.offerPrice,
              problem: data.problem,
              problemSolving: data.problemSolving,
              solutions: data.solutions || [],
              eatProduct: data.eatProduct,
              useProduct: data.useProduct,
              contactNumber: data.contactNumber || [],
              imageFiles: [], // If the images are being fetched from the backend, initialize empty.
              imagePreviews: data.reviews || [],
              mainImageFile: null,
            });
          }
        } catch (error) {
          toast.error("Error fetching product details.");
          console.error(error);
        }
      };
      fetchProductDetails();
    }
  }, [id, data, refetch]);

  if (isLoading || prodLoad) {
    return <div>Loading...</div>;
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
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            id="imageUrl"
          />
          {productData.imageUrl && (
            <img
              src={
                id ? getImageUrl(productData.imageUrl) : productData.imageUrl
              } // preview string
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
        <div>
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
                  src={id ? getImageUrl(src) : src}
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
          {isLoading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
