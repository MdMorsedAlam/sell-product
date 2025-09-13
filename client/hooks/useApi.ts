import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import axiosSecure from "./UseAxiosSecure";
import toast from "react-hot-toast";

// useApi hook to fetch data
export function useApi<TData = unknown>(
  key: QueryKey,
  endpoint: string,
  enabled = true
) {
  return useQuery<TData>({
    queryKey: key,
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(endpoint);
        return res.data.data;
      } catch (error: any) {
        toast.error("Error fetching data.");
        throw error;
      }
    },
    enabled,
  });
}

// usePost hook to send data via POST request
export function usePost<TPayload = any, TResponse = any>(
  endpoint: string,
  keyToInvalidate?: QueryKey
) {
  const queryClient = useQueryClient();

  return useMutation<TResponse, unknown, TPayload>({
    mutationFn: async (data) => {
      try {
        const res = await axiosSecure.post(endpoint, data);
        return res.data;
      } catch (error: any) {
        toast.error("Error posting data.");
        throw error;
      }
    },
    onSuccess: () => {
      if (keyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: keyToInvalidate });
      }
    },
    onError: () => {
      toast.error("Error posting data.");
    },
  });
}
export function usePostWithFiles<TPayload = any, TResponse = any>(
  endpoint: string,
  keyToInvalidate?: QueryKey
) {
  const queryClient = useQueryClient();

  return useMutation<TResponse, unknown, TPayload>({
    mutationFn: async (data) => {
      const isFormData =
        typeof FormData !== "undefined" && data instanceof FormData;
      
      // Log FormData to check
      console.log("FormData being sent:", data);

      const res = await axiosSecure.post(endpoint, data, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      if (keyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: keyToInvalidate });
      }
    },
    onError: () => {
      toast.error("Failed to submit the data.");
    },
  });
}


// usePut hook to send data via PUT request
export function usePut<TPayload = any, TResponse = any>(
  endpoint: string,
  keyToInvalidate?: QueryKey
) {
  const queryClient = useQueryClient();

  return useMutation<TResponse, unknown, TPayload>({
    mutationFn: async (data) => {
      try {
        const res = await axiosSecure.put(endpoint, data);
        return res.data;
      } catch (error: any) {
        toast.error("Error updating data.");
        throw error;
      }
    },
    onSuccess: () => {
      if (keyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: keyToInvalidate });
      }
      toast.success("Data updated successfully!");
    },
    onError: () => {
      toast.error("Error updating data.");
    },
  });
}
export function usePatch<TPayload = any, TResponse = any>(
  getEndpoint: (id: string) => string,
  keyToInvalidate?: QueryKey
) {
  const queryClient = useQueryClient();

  return useMutation<TResponse, unknown, { id: string; data: TPayload }>({
    mutationFn: async ({ id, data }) => {
      try {
        const endpoint = getEndpoint(id);

        const res = await axiosSecure.patch(endpoint, data);

        return res.data;
      } catch (error: any) {
        toast.error("Error updating data with files.");
        throw error;
      }
    },
    onSuccess: () => {
      if (keyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: keyToInvalidate });
      }
      toast.success("Data updated with files successfully!");
    },
    onError: () => {
      toast.error("Error updating data with files.");
    },
  });
}
// usePatchWithFiles hook to send PATCH request with files
export function usePatchWithFiles<TPayload = any, TResponse = any>(
  getEndpoint: (id: string) => string,
  keyToInvalidate?: QueryKey
) {
  const queryClient = useQueryClient();

  return useMutation<TResponse, unknown, { id: string; data: TPayload }>({
    mutationFn: async ({ id, data }) => {
      try {
        const endpoint = getEndpoint(id);
        const isFormData =
          typeof FormData !== "undefined" && data instanceof FormData;

        const res = await axiosSecure.patch(endpoint, data, {
          headers: isFormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
        });

        return res.data;
      } catch (error: any) {
        toast.error("Error updating data with files.");
        throw error;
      }
    },
    onSuccess: () => {
      if (keyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: keyToInvalidate });
      }
      toast.success("Data updated successfully!");
    },
    onError: () => {
      toast.error("Error updating data with files.");
    },
  });
}
export function usePatchForProductWithFiles<TPayload = any, TResponse = any>(
  getEndpoint: (id: any) => any,
  keyToInvalidate?: QueryKey
) {
  const queryClient = useQueryClient();

  return useMutation<TResponse, unknown, { id: any; data: TPayload }>({
    mutationFn: async ({ id, data }) => {
      try {
        const endpoint = getEndpoint(id);
        const isFormData =
          typeof FormData !== "undefined" && data instanceof FormData;

        const res = await axiosSecure.patch(endpoint, data, {
          headers: isFormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
        });

        return res.data;
      } catch (error: any) {
        toast.error("Error updating data with files.");
        throw error;
      }
    },
    onSuccess: () => {
      if (keyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: keyToInvalidate });
      }
      toast.success("Data updated successfully!");
    },
    onError: () => {
      toast.error("Error updating data with files.");
    },
  });
}

export function usePatchForPoll<TPayload = any, TResponse = any>(
  getEndpoint: (pollId: string, optionId: string) => string, // Accept two IDs
  keyToInvalidate?: QueryKey
) {
  const queryClient = useQueryClient();

  return useMutation<
    TResponse,
    unknown,
    { pollId: string; optionId: string; data: TPayload }
  >({
    mutationFn: async ({ pollId, optionId, data }) => {
      try {
        // Dynamically generate the endpoint for the PATCH request
        const endpoint = getEndpoint(pollId, optionId);

        // Perform the PATCH request without file data
        const res = await axiosSecure.patch(endpoint, data);

        return res.data; // Return the response data
      } catch (error: any) {
        toast.error("Error updating data.");
        throw error; // Handle errors properly
      }
    },
    onSuccess: () => {
      if (keyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: keyToInvalidate }); // Invalidate the relevant queries
      } // Success message
    },
    onError: () => {
      toast.error("Error updating data.");
    },
  });
}
// usePatchStatus to update the order status via PATCH request
export function usePatchStatus() {
  const queryClient = useQueryClient();

  return useMutation<any, unknown, { endpoint: string; data: any }>({
    mutationFn: async ({ endpoint, data }) => {
      try {
        const res = await axiosSecure.patch(endpoint, data);  // Dynamic endpoint
        return res.data;
      } catch (error: any) {
        toast.error("Error updating order status.");
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Order status updated successfully!");
    },
    onError: () => {
      toast.error("Error updating order status.");
    },
  });
}
// useDelete hook to send DELETE request
export function useDelete<TResponse = any>(
  endpoint: (id: string | number) => string,
  keyToInvalidate?: QueryKey
) {
  const queryClient = useQueryClient();

  return useMutation<TResponse, unknown, string | number>({
    mutationFn: async (id) => {
      try {
        const res = await axiosSecure.delete(endpoint(id));
        return res.data;
      } catch (error: any) {
        toast.error("Error deleting data.");
        throw error;
      }
    },
    onSuccess: () => {
      if (keyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: keyToInvalidate });
      }
    },
    onError: () => {
      toast.error("Error deleting data.");
    },
  });
}
