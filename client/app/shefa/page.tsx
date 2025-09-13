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
import { IProduct } from "@/types";
import { useApi, usePost } from "@/hooks/useApi";
import toast from "react-hot-toast";
import { getImageUrl } from "@/hooks/useGetImage";
import { useRouter } from "next/navigation";

function HaluwaPage() {
  const [shefa, setShefa] = useState<IProduct>({} as IProduct);
  const { data, isLoading, refetch } = useApi<IProduct[]>(
    ["products"],
    "/products"
  );
  const { mutate: createOrder } = usePost("/orders/create", ["orders"]);
  const router = useRouter();
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
        totalPrice: shefa ? shefa.offerPrice : "0",
        product: shefa ? shefa._id : "",
        orderDate: new Date(),
      });
      // Reset file input value
      const fileInput = document.getElementById("imageUrl") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      router.push(`/thanks/shefa`);
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
          const findData = data.find((item) => item.name === "Shefa Mixed");
          setFormValues((prev) => ({
            ...prev,
            totalPrice: findData ? findData.offerPrice : "",
            product: findData ? findData._id : "",
          }));
          setShefa(findData as IProduct);
        }
      } catch (error) {
        toast.error("Error fetching articles");
      }
    };
    fetchData();
  }, [data, isLoading]);
  //  console.log("shefa", shefa);
  return (
    <section className="bg-[#C2F0C9] text-black px-0 md:px-5 pb-4 md:pb-10">
      <div className="lg:w-[1140px] w-full min-h-fit mx-auto bg-[#FEF9E0] px-2 md:px-5">
        <h1 className="text-center font-bold pt-4 text-5xl">"শিফা মিক্স"</h1>
        <h4 className="text-center font-bold text-2xl my-3">তিন নেয়ামত</h4>
        <h3 className="text-center font-bold text-3xl mb-3">
          {/* মৃত্যু ব্যতিত সকল রোগের ঔষধ । */}
          {shefa?.title}
        </h3>
        <p className="text-center font-semibold text-2xl text-[#601A09]">
          {/* কালোজিরা, মধু,রসুন, ইরানী জাফরান এই চারটি খাবার যদি খেতে পারেন মৃত্যুর
          আগ পর্যন্ত যৌবনশক্তি কমবে না যাদের যৌবন শক্তি কমে গিয়েছে তারা হারানো
          যৌবন ফিরে আসবে ইনশাল্লাহ */}
          {shefa?.subTitle}
        </p>
        <p className="text-center font-semibold text-xl text-green-500 border-2 border-dashed border-black p-4 my-5">
          {/* শারীরিক দুর্বলতার জন্য আর কত ডাক্তার আরফার্মেসি ঔষধের পিছনে ঘুরবেন,
          ওষুধ খেয়ে নিজেকে আর কত ধ্বংস করবেন, বেছেনিন বিজ্ঞানসম্মত কোরআনের
          চিকিৎসা,কালোজিরা,মধু,ফার্মটেক রসুন এবং ইরানি সুপারনিকিন জাফরানের এই
          অনন্য মিশ্রণ ।<br />
          🌟১০০% প্রাকৃতিক – কোন কেমিকেল নেই */}
          {shefa?.description}
          <br /> 🌟১০০% প্রাকৃতিক – কোন কেমিকেল নেই ।
        </p>
        <button className="text-3xl flex items-center justify-center bg-blue-600 hover:bg-[#25B214] text-white font-bold py-3 px-4 rounded-lg my-5 mx-auto">
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
            {shefa?.buttonText}
          </a>
          {/* অর্ডার করতে চাই */}
        </button>
        <div
          className="h-[400px] lg:h-[800px] m-2 md:m-16"
          style={{
            boxShadow:
              "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
          }}
        >
          <img
            className="w-full h-full rounded-xl object-center"
            src={getImageUrl(shefa?.imageUrl)}
            alt={shefa?.name}
          />
        </div>
        <div className="text-center text-2xl font-bold my-5">
          <div className="p-4 border-2 border-dashed mb-4 inline-block rounded-lg border-yellow-500">
            <h1> {shefa?.gift}</h1>
          </div>
          <p>
            রেগুলার মূল্য <del className="text-red-500">{shefa?.price}</del>{" "}
            টাকা
          </p>
          <p>
            অফার মূল্য{" "}
            <span className="text-blue-600">{shefa?.offerPrice} &nbsp;</span>
            টাকা ৫০০ গ্রাম শিফা মিক্স
            {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 500 150"
                    preserveAspectRatio="none"
                    className="__web-inspector-hide-shortcut__"
                  >
                    <path d="M5,125.4c30.5-3.8,137.9-7.6,177.3-7.6c117.2,0,252.2,4.7,312.7,7.6"></path>
                    <path d="M26.9,143.8c55.1-6.1,126-6.3,162.2-6.1c46.5,0.2,203.9,3.2,268.9,6.4"></path>
                  </svg> */}
          </p>
        </div>
        {/* <div className="flex justify-center items-center h-screen bg-[#f0f8ff]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 150"
            preserveAspectRatio="none"
          >
            <path
              className="animated-path"
              d="M5,125.4c30.5-3.8,137.9-7.6,177.3-7.6c117.2,0,252.2,4.7,312.7,7.6"
              fill="transparent"
              stroke="#ff7f00"
              strokeWidth="2"
            />
            <path
              className="animated-path"
              d="M26.9,143.8c55.1-6.1,126-6.3,162.2-6.1c46.5,0.2,203.9,3.2,268.9,6.4"
              fill="transparent"
              stroke="#ff7f00"
              strokeWidth="2"
            />
          </svg>
        </div> */}
        <button className="text-3xl flex items-center justify-center bg-blue-600 hover:bg-[#25B214] text-white font-bold py-3 px-4 rounded-lg my-5 mx-auto">
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
            {shefa?.buttonText}
          </a>
        </button>

        <p className="text-center text-[#601A09] font-semibold text-xl mb-4">
          {/* প্রথম ১-২ মিনিটেই কি আপনি ক্লান্ত হয়ে পড়েন যৌন ইচ্ছা ও শক্তির অভাব এবং
          পার্টনারের সাথে দীর্ঘ সময় একসাথে থাকতে না পারা এগুলো সাধারণ সমস্যা হতে
          পারে। তবে আর চিন্তা করবেন না হালুয়া মোহাব্বত আপনার জন্য একটি আশীর্বাদ
          হতে পারে। */}
          {shefa?.problem}
        </p>
        <div className="bg-blue-600 py-10 flex flex-col items-center justify-center">
          <h1 className="text-white text-4xl font-bold py-4">
            {shefa?.problemSolving}
          </h1>

          {/* Cards */}
          <div className="space-y-4 w-full max-w-full px-5">
            {/* Card 1 */}
            {shefa?.solutions?.map((solution, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-lg font-medium text-red-500">{solution}</p>
              </div>
            ))}

            {/* <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg font-medium text-green-700">
                ✓টেস্টোস্টেরন হরমোন বৃদ্দি করবে এবং বীর্যটাকে ঘাড় করবে !
              </p>
            </div> */}

            {/* <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg font-medium text-green-700">
                ✓যৌন চাহিদা বাড়বে বহুগুন !
              </p>
            </div> */}

            {/* <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg font-medium text-green-700">
                ✓সব ধরনের ঠান্ডা জনিত সমস্যার সমাধান করবে !
              </p>
            </div> */}

            {/* <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg font-medium text-green-700">
                ✓শরীরে প্রচন্ড ব্যাথা অথবা বাত ব্যথা দূর করবে !
              </p>
            </div> */}
            {/* <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg font-medium text-green-700">
                ✓গ্যাস্টিকের কারনে বুক জালাপোড়া বা পেট ফাফা দিয়ে থাকা দুর করবে
                !
              </p>
            </div> */}
            {/* <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg font-medium text-green-700">
                ✓ডায়াবেটিকস এবং উচ্চরক্তচাপ দুর করবে !
              </p>
            </div> */}
            <p className="text-2xl font-bold leading-relaxed text-center text-white">
              👉এখানে যে সমস্যাগুলো বলা হয়েছে এর মধ্য থেকে আপনার যেকোনো সমস্যা
              থাকলে এই শিফা মিক্স এর মাধ্যমে সেরে যাবে
            </p>
          </div>
        </div>
        <button className="text-3xl flex items-center justify-center bg-blue-600 hover:bg-[#25B214] text-white font-bold py-3 px-4 rounded-lg my-5 mx-auto">
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
            {shefa?.buttonText}
          </a>
        </button>
        <div className=" py-4 px-2 md:px-5 font-['Inter']">
          <h3 className="text-3xl border-b-2 pb-2 border-dashed border-yellow-500 font-extrabold text-center mb-6 text-gray-800">
            ব্যবহারবিধি
          </h3>

          {/* Content Box with Border */}
          <div className="p-8 border-2 border-gray-400 rounded-lgbg-gray-50">
            <div className="text-xl font-bold leading-relaxed text-center">
              <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
                শিফা মিক্স খাবারের নিয়ম
              </h2>
              {shefa?.eatProduct}
              {/* <h2 className="text-3xl font-extrabold text-center my-6 text-gray-800">
                ম্যাসেজ অয়েল ব্যবহার করার নিয়ম
              </h2>
              👉ম্যাসেজ অয়েল টি প্রতিদিন রাতে , আপনার বিশেষ অঙ্গে , নিচ থেকে
              ওপরে এভাবে ২/৩ মিনিট মালিশ করবেন */}
            </div>
          </div>
        </div>
        <h3 className="text-3xl border-b-2 pb-2 border-dashed border-yellow-500 font-extrabold text-center mb-6 text-gray-800">
          কাষ্টমার রিভিউ
        </h3>
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
            {shefa?.reviews?.map((review, index) => (
              <SwiperSlide key={index}>
                <img
                  className="w-12 h-12 rounded-md object-center"
                  src={getImageUrl(review)}
                  alt={shefa?.name}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {/* Billing Info */}
      <h3
        id="orderForm"
        className="text-4xl border-b-2 pb-2 border-dashed border-yellow-500 font-extrabold text-center mb-6 text-yellow-800"
      >
        ডেলিভারি চার্জ ফ্রি
      </h3>
      <p className="text-3xl pb-2 font-bold text-center text-green-800">
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
                  src={getImageUrl(shefa?.imageUrl)}
                  alt={shefa?.name}
                />
                শিফা মিক্স
              </span>
              <span className="text-lg font-bold">৳ {shefa?.offerPrice}</span>
            </div>

            <div className="flex justify-between mt-2 border-b border-green-500">
              <span className="text-lg font-bold">ডেলিভারি চার্জ ফ্রি</span>
              <span className="text-lg font-bold">৳ ০০</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-lg font-bold">মোট</span>
              <span className="text-lg font-bold">৳ {shefa?.offerPrice}</span>
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
                আপনার নাম লিখুন <span className="text-red-600 text-xl">*</span>
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
      <div className="bg-green-800 mx-2 text-3xl text-white p-4 rounded-xl text-center font-extrabold">
        <div>
          প্রয়োজনে কল করুন :-{" "}
          {shefa?.contactNumber?.map((numb, index) => (
            <p key={index}>{numb}</p>
          ))}
        </div>{" "}
      </div>
    </section>
  );
}

export default HaluwaPage;
