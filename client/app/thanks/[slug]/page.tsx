"use client";
import { useApi } from "@/hooks/useApi";
import { getImageUrl } from "@/hooks/useGetImage";
import { IProduct } from "@/types";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function ThanksPage() {
  const { slug } = useParams();
  const [productName, setProductName] = useState("");
  const [myData, setMyData] = useState<IProduct | undefined>(undefined);
  const { data, isLoading, refetch } = useApi<IProduct[]>(
    ["products"],
    "/products"
  );

  useEffect(() => {
    if (data && Array.isArray(data)) {
      let findData;
      switch (slug) {
        case "mohabbat":
          findData = data.find((item) => item.name === "Halwa Mohabbot");
          setProductName("হালুয়া মহাব্বত ৫০০ গ্রাম");
          break;
        case "halwa":
          findData = data.find((item) => item.name === "Haluwa");
          setProductName("হালুয়া মোহাব্বত ৫০০ গ্রাম");
          break;
        default:
          findData = data.find((item) => item.name === "Shefa Mixed");
          setProductName("শিফা মিক্স");
          break;
      }
      setMyData(findData);
    }
  }, [data, slug]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  //   const displayName = productName[slug] || "Unknown Product";

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-100 p-2">
      <div className="bg-white w-full h-full p-4 rounded-lg">
        <h1
          className={`text-6xl ${
            productName === "শিফা মিক্স" ? "text-[#31a75e]" : "text-[#FF8C05]"
          } mb-3 text-center font-extrabold`}
        >
          ধন্যবাদ
        </h1>
        <h3 className="text-3xl text-center text-black font-bold">
          আপনার অর্ডারটি আমরা পেয়েছি
        </h3>
        <p className="text-2xl mt-4 text-black text-center font-semibold">
          আপনার প্রোডাক্ট টি ২ থেকে ৩ দিনের ভিতরে আপনার কাছে পৌঁছে যাবে! খুব
          দ্রুত আপনার সাথে যোগাযোগ করা হবে। অনুগ্রহ করে অপেক্ষা করুন।
        </p>
        <div className="w-full mt-10">
          <h2
            className={`text-xl font-bold mb-4 border-b-2  ${
              productName === "শিফা মিক্স"
                ? "border-blue-500 text-blue-600"
                : "border-green-500 text-green-600"
            }  pb-2`}
          >
            বিলিং পণ্য
          </h2>
          <div className="space-y-4 text-black">
            <div
              className={`flex justify-between text-xl font-semibold border-b  ${
                productName === "শিফা মিক্স"
                  ? "border-blue-500"
                  : "border-green-500"
              } text-gray-700`}
            >
              <span>পণ্য</span>
              <span>সাব টোটাল</span>
            </div>
            <div className="flex justify-between text-black">
              <span className="flex items-center gap-2 text-lg font-semibold">
                <img
                  className="w-12 h-12 rounded-md object-center"
                  src={getImageUrl(myData?.imageUrl || "")}
                  alt={myData?.name || "Product image"}
                />
                {productName}
              </span>
              <span className="text-lg font-bold">
                ৳ {myData?.offerPrice || "N/A"}
              </span>
            </div>

            <div
              className={`flex justify-between mt-2 border-b text-black ${
                productName === "শিফা মিক্স"
                  ? "border-blue-500"
                  : "border-green-500"
              }`}
            >
              <span className="text-lg font-bold">ডেলিভারি চার্জ ফ্রি</span>
              <span className="text-lg font-bold">৳ ০০</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-lg font-bold">মোট</span>
              <span className="text-lg font-bold">
                ৳ {myData?.offerPrice || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThanksPage;
