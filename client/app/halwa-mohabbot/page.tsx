"use client";
import React, { useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./styles.css";

// import required modules
import {
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
  Autoplay,
} from "swiper/modules";
import { useApi, usePost } from "@/hooks/useApi";
import { IProduct } from "@/types";
import toast from "react-hot-toast";
import { getImageUrl } from "@/hooks/useGetImage";
import { useRouter } from "next/navigation";

function HaluwaPage() {
  const [halwa, setHalwa] = useState<IProduct | null>(null);
  const router = useRouter();
  const { data, isLoading, refetch } = useApi<IProduct>(
    ["products"],
    "/products"
  );
  const { mutate: createOrder } = usePost("/orders/create", ["orders"]);
  // Form state
  const [formValues, setFormValues] = useState({
    name: "",
    address: "",
    phone: "",
    totalPrice: "0",
    product: "", // Example product ID, replace with actual ID
    orderDate: new Date(),
  });
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  // Handle form submission
  const handelOrderSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formValues.name || !formValues.address || !formValues.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await createOrder(formValues);
      toast.success("Product created successfully!");
      // Reset form
      setFormValues({
        name: "",
        address: "",
        phone: "",
        totalPrice: halwa ? halwa.offerPrice : "0",
        product: halwa ? halwa._id : "",
        orderDate: new Date(),
      });
      // Reset file input value
      const fileInput = document.getElementById("imageUrl") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      router.push(`/thanks/mohabbat`);
    } catch (error) {
      toast.error("Failed to create product. Please try again.");
    } finally {
      refetch();
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetch();
        if (Array.isArray(data)) {
          const findData = data.find((item) => item.name === "Halwa Mohabbot");
          setFormValues((prev) => ({
            ...prev,
            totalPrice: findData ? findData.offerPrice : 0,
            product: findData ? findData._id : "",
          }));
          setHalwa(findData);
        }
      } catch (error) {
        toast.error("Error fetching articles");
      }
    };
    fetchData();
  }, [data, isLoading]);
  return (
    <section className="bg-white pt-3 pb-6 text-black">
      <h1 className="bg-[#FF8C00] p-6 text-6xl text-center font-extrabold">
        হালুয়া মোহাব্বত
      </h1>
      <div className="px-2">
        <h3 className="text-5xl font-bold text-center my-8">
          ৫০০ গ্রাম হালুয়া
          <p className="mt-3">
            রেগুলার মূল্য - <del className="text-red-500">{halwa?.price}</del>
            /-টাকা
          </p>
        </h3>
        <button className="text-3xl flex items-center justify-center bg-yellow-500 hover:bg-blue-600 text-white font-bold py-3 px-6 border-4 border-black rounded-full my-5 mx-auto">
          <a href="#orderForm">
            {" "}
            <svg
              aria-hidden="true"
              className="e-font-icon-svg e-fas-cart-arrow-down w-8 h-8 inline-block mr-2"
              viewBox="0 0 576 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M504.717 320H211.572l6.545 32h268.418c15.401 0 26.816 14.301 23.403 29.319l-5.517 24.276C523.112 414.668 536 433.828 536 456c0 31.202-25.519 56.444-56.824 55.994-29.823-.429-54.35-24.631-55.155-54.447-.44-16.287 6.085-31.049 16.803-41.548H231.176C241.553 426.165 248 440.326 248 456c0 31.813-26.528 57.431-58.67 55.938-28.54-1.325-51.751-24.385-53.251-52.917-1.158-22.034 10.436-41.455 28.051-51.586L93.883 64H24C10.745 64 0 53.255 0 40V24C0 10.745 10.745 0 24 0h102.529c11.401 0 21.228 8.021 23.513 19.19L159.208 64H551.99c15.401 0 26.816 14.301 23.403 29.319l-47.273 208C525.637 312.246 515.923 320 504.717 320zM403.029 192H360v-60c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v60h-43.029c-10.691 0-16.045 12.926-8.485 20.485l67.029 67.029c4.686 4.686 12.284 4.686 16.971 0l67.029-67.029c7.559-7.559 2.205-20.485-8.486-20.485z"
                className="fill-white"
              ></path>
            </svg>
            {halwa?.buttonText}
          </a>
        </button>
        <div className="bg-yellow-100 max-w-md mx-auto my-5 border-2 border-dotted border-black">
          <h3 className="text-4xl font-bold text-center my-8">
            বর্তমান অফারে পাচ্ছেন মাত্র -{" "}
            <strong className="text-green-500">{halwa?.offerPrice}</strong>
            /-টাকা
          </h3>
        </div>
      </div>

      <div className="flex justify-center">
        <div
          className="h-[400px] lg:h-[800px] m-2 max-w-lg md:m-10"
          style={{
            boxShadow:
              "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
          }}
        >
          <img
            className="w-full h-full rounded-xl object-center"
            src={getImageUrl(halwa?.imageUrl)}
            alt={halwa?.name}
          />
        </div>
      </div>
      {/* <h3 className="text-5xl font-bold text-center py-10">
        ৫০০ গ্রাম{" "}
        <strong className="text-green-500">{halwa?.offerPrice}</strong> টাকা
      </h3> */}
      <div className="flex justify-center px-2">
        <div className="p-4 border-2  border-dashed mb-4 inline-block rounded-lg border-green-500">
          <h1 className="text-[#FF8C00] text-3xl py-4 font-extrabold">
            {halwa?.gift}
          </h1>
        </div>
      </div>
      <h3 className="text-5xl font-bold text-green-500 text-center my-8">
        হোম ডেলিভারি ফ্রী
      </h3>
      <button className="text-3xl flex items-center justify-center bg-yellow-500 hover:bg-blue-600 text-white font-bold py-3 px-6 border-4 border-black rounded-full my-5 mx-auto">
        <a href="#orderForm">
          {" "}
          <svg
            aria-hidden="true"
            className="e-font-icon-svg e-fas-cart-arrow-down w-8 h-8 inline-block mr-2"
            viewBox="0 0 576 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M504.717 320H211.572l6.545 32h268.418c15.401 0 26.816 14.301 23.403 29.319l-5.517 24.276C523.112 414.668 536 433.828 536 456c0 31.202-25.519 56.444-56.824 55.994-29.823-.429-54.35-24.631-55.155-54.447-.44-16.287 6.085-31.049 16.803-41.548H231.176C241.553 426.165 248 440.326 248 456c0 31.813-26.528 57.431-58.67 55.938-28.54-1.325-51.751-24.385-53.251-52.917-1.158-22.034 10.436-41.455 28.051-51.586L93.883 64H24C10.745 64 0 53.255 0 40V24C0 10.745 10.745 0 24 0h102.529c11.401 0 21.228 8.021 23.513 19.19L159.208 64H551.99c15.401 0 26.816 14.301 23.403 29.319l-47.273 208C525.637 312.246 515.923 320 504.717 320zM403.029 192H360v-60c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v60h-43.029c-10.691 0-16.045 12.926-8.485 20.485l67.029 67.029c4.686 4.686 12.284 4.686 16.971 0l67.029-67.029c7.559-7.559 2.205-20.485-8.486-20.485z"
              className="fill-white"
            ></path>
          </svg>
          {halwa?.buttonText}
        </a>
      </button>

      <div className="max-w-5xl mx-auto p-2">
        <h1 className="bg-[#FF8C00] my-10 text-white p-6 text-3xl text-center border-4 border-dotted border-black font-extrabold">
          {/* অসাধারণ ক্ষমতাসম্পন্ন এই হালুয়া ও তেলটি ব্যবহার করলেই ? */}
          {halwa?.problemSolving}
        </h1>

        <ul className="border-2 border-black p-4 text-black text-xl space-y-2">
          {halwa?.solutions?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}

          {/* <li>✅ যৌ-ন শক্তি বৃদ্ধি করবে ।</li>
          <li>✅ আগা মোটা গোড়া চিকন সমস্যা দুর হবে ।</li>
          <li>✅ দ্রুত বী-র্য পাত রোধ করে।</li>
          <li>✅ লি’-ঙ্গ বাঁকা সমস্যা সমাধান করবে ।</li>
          <li>✅ সিড়া বা রগ ফুলে থাকলে সমাধান করবে ।</li>
          <li>✅ লি’-ঙ্গ মোটা এবং লম্বা করতে গুরুত্বপূর্ণ কাজ করে ।</li>
          <li>✅ শু-ক্রানুর পরিমান বৃদ্ধি করে ।</li>
          <li>✅ লি’-ঙ্গের সতেজতা ফিরিয়ে আনে ।</li>
          <li>✅ সে’-ক্স তন্ত্র সুস্থ থাকে।</li>
          <li>✅ টিসুগুলো নতুন করে শক্তি সঞ্চারিত করবে ।</li>
          <li>✅ আগের তুলনায় দ্রুত উত্তে-জিত করবে করে ।</li> */}
        </ul>
        <div className=" py-4 font-['Inter']">
          <h3 className="text-3xl border-b-2 pb-2 border-dashed border-yellow-500 font-extrabold text-center mb-6 text-gray-800">
            ব্যবহারবিধি
          </h3>

          {/* Content Box with Border */}
          <div className="p-8 border-2 border-gray-400 rounded-lgbg-gray-50">
            <div className="text-xl font-bold leading-relaxed text-center">
              <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
                হালুয়া খাবারের নিয়ম
              </h2>
              {halwa?.eatProduct}
              {/* 👉প্রতিদিন রাতে, খাবার ৩০ মিনিট পরে, এক-চামচ হালুয়া পানি দিয়ে
              খাবেন অথবা মধু দিয়ে খাবেন অথবা২৫০ গ্রাম দুধ থাকলে দুধের সাথে মিক্স
              করে খাবেন। <br /> */}
              <h2 className="text-3xl font-extrabold text-center my-6 text-gray-800">
                ম্যাসেজ অয়েল ব্যবহার করার নিয়ম
              </h2>
              {halwa?.useProduct}
              {/* 👉ম্যাসেজ অয়েল টি প্রতিদিন রাতে , আপনার বিশেষ অঙ্গে , নিচ থেকে
              ওপরে এভাবে ২/৩ মিনিট মালিশ করবেন */}
            </div>
          </div>
        </div>
        <button className="text-3xl flex items-center justify-center bg-yellow-500 hover:bg-blue-600 text-white font-bold py-3 px-6 border-4 border-black rounded-full my-5 mx-auto">
          <a href="#orderForm">
            {" "}
            <svg
              aria-hidden="true"
              className="e-font-icon-svg e-fas-cart-arrow-down w-8 h-8 inline-block mr-2"
              viewBox="0 0 576 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M504.717 320H211.572l6.545 32h268.418c15.401 0 26.816 14.301 23.403 29.319l-5.517 24.276C523.112 414.668 536 433.828 536 456c0 31.202-25.519 56.444-56.824 55.994-29.823-.429-54.35-24.631-55.155-54.447-.44-16.287 6.085-31.049 16.803-41.548H231.176C241.553 426.165 248 440.326 248 456c0 31.813-26.528 57.431-58.67 55.938-28.54-1.325-51.751-24.385-53.251-52.917-1.158-22.034 10.436-41.455 28.051-51.586L93.883 64H24C10.745 64 0 53.255 0 40V24C0 10.745 10.745 0 24 0h102.529c11.401 0 21.228 8.021 23.513 19.19L159.208 64H551.99c15.401 0 26.816 14.301 23.403 29.319l-47.273 208C525.637 312.246 515.923 320 504.717 320zM403.029 192H360v-60c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v60h-43.029c-10.691 0-16.045 12.926-8.485 20.485l67.029 67.029c4.686 4.686 12.284 4.686 16.971 0l67.029-67.029c7.559-7.559 2.205-20.485-8.486-20.485z"
                className="fill-white"
              ></path>
            </svg>
            {halwa?.buttonText}
          </a>
        </button>
        <h1 className="bg-[#FF8C00] w-fit mx-auto my-10 p-6 text-3xl text-center border-4 border-dotted border-black font-extrabold">
          আমাদের উপর কেন আস্থা রাখবেন?
        </h1>
        <div className="w-full h-[200px] md:h-[400px] mb-10">
          {/* Autoplay Slider Component */}
          <Swiper
            cssMode={true}
            navigation={true}
            mousewheel={true}
            keyboard={true}
            slidesPerView={1}
            spaceBetween={30}
            loop={true} // Ensures the slides loop infinitely
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 2500, // Time interval between slides (in milliseconds)
              disableOnInteraction: false, // Keeps autoplay running even after user interacts with the swiper
            }}
            modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]} // Add Autoplay module here
            className="mySwiper"
          >
            {halwa?.reviews?.map((review, index) => (
              <SwiperSlide key={index}>
                <img
                  className="w-12 h-12 rounded-md object-center"
                  src={getImageUrl(review)}
                  alt={halwa?.name}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div
        id="orderForm"
        className="bg-yellow-100 border-4 rounded-lg border-dashed border-black m-2 p-2"
      >
        <p className="text-3xl py-2 font-bold text-center text-green-800">
          অর্ডার করতে সঠিক তথ্য দিয়ে নিচের ফর্ম টি পুরণ করুন
        </p>
        <div className="container mx-auto flex flex-col lg:flex-row justify-between gap-6 px-4 py-8">
          {/* Right Column: Order Summary */}

          <div className="w-full">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-green-500 pb-2 text-green-600">
              বিলিং পণ্য
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between text-xl font-semibold border-b border-green-500 text-gray-700">
                <span>পণ্য</span>
                <span>সাব টোটাল</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-2 text-lg font-semibold">
                  <img
                    className="w-12 h-12 rounded-md object-center"
                    src={getImageUrl(halwa?.imageUrl)}
                    alt={halwa?.name}
                  />
                  হালুয়া মোহাব্বত ৫০০ গ্রাম
                </span>
                <span className="text-lg font-bold">৳ {halwa?.offerPrice}</span>
              </div>

              <div className="flex justify-between mt-2 border-b border-green-500">
                <span className="text-lg font-bold">ডেলিভারি চার্জ ফ্রি</span>
                <span className="text-lg font-bold">৳ ০০</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-lg font-bold">মোট</span>
                <span className="text-lg font-bold">৳ {halwa?.offerPrice}</span>
              </div>
            </div>
          </div>
          {/* Left Column: Billing Details */}
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-green-500 pb-2 text-green-600">
              বিলিং ঠিকানা
            </h2>

            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="text-lg flex items-center gap-1 font-semibold text-green-700"
                >
                  আপনার নাম লিখুন{" "}
                  <span className="text-red-600 text-xl">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="আপনার নাম লিখুন"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="text-lg flex items-center gap-1 font-semibold text-green-700"
                >
                  আপনার সম্পূর্ণ ঠিকানা লিখুন{" "}
                  <span className="text-red-600 text-xl">*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formValues.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="আপনার ঠিকানা লিখুন"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="text-lg flex items-center gap-1 font-semibold text-green-700"
                >
                  আপনার মোবাইল নাম্বার লিখুন{" "}
                  <span className="text-red-600 text-xl">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formValues.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="মোবাইল নম্বর লিখুন"
                />
              </div>

              <button
                onClick={handelOrderSubmit}
                className="text-3xl w-full bg-[#FB8500] hover:bg-[#25B214] text-white font-bold py-3 px-4 rounded-lg my-5"
              >
                অর্ডার সম্পন্ন করুন
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-green-800 mx-2 text-3xl text-white p-4 rounded-xl text-center font-extrabold">
        <div>
          প্রয়োজনে কল করুন :-{" "}
          {halwa?.contactNumber?.map((numb, index) => (
            <p key={index}>
              <a
                href={`tel:${numb}`}
                className="text-white hover:text-yellow-400"
              >
                {numb}
              </a>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HaluwaPage;
