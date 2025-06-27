import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { STATES } from "../data/states";
import { useUserContext } from "../context/UserContext";
import type { User } from "../types";
import { v4 as uuidv4 } from "uuid";

interface UserFormProps {
  defaultValues?: User | null;
  onResetEditing?: () => void;
}

const schema = z.object({
  name: z.string().nonempty("Name is required")
    .regex(/^[A-Za-z ]+$/, "Only letters and spaces allowed"),
  age: z.coerce.number().min(1, "Age must be a valid number"),
  gender: z.enum(["Male", "Female", "Other"]),
  state: z.string().nonempty("State is required"),
});

type FormData = z.infer<typeof schema>;

const UserForm: React.FC<UserFormProps> = ({ defaultValues, onResetEditing }) => {
  const { addUser, updateUser } = useUserContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {
      name: "",
      age: 0,
      gender: "Male",
      state: "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmit = (data: FormData) => {
    const user: User = {
      ...data,
      id: defaultValues?.id ?? uuidv4(),
    };

    if (defaultValues) {
      updateUser(user);
      onResetEditing?.();
    } else {
      addUser(user);
    }

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl p-4 border rounded-xl shadow-md bg-white">
      <div>
        <label className="block font-semibold">Name</label>
        <input {...register("name")} className="w-full border px-3 py-2 rounded" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block font-semibold">Age</label>
        <input type="number" {...register("age")} className="w-full border px-3 py-2 rounded" />
        {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
      </div>

      <div>
        <label className="block font-semibold">Gender</label>
        <div className="flex gap-4">
          {["Male", "Female", "Other"].map((g) => (
            <label key={g}>
              <input type="radio" value={g} {...register("gender")} className="mr-1" />
              {g}
            </label>
          ))}
        </div>
        {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
      </div>

      <div>
        <label className="block font-semibold">State</label>
        <select {...register("state")} className="w-full border px-3 py-2 rounded">
          <option value="">Select a state</option>
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
      </div>

      <div className="flex gap-2">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          {defaultValues ? "Update User" : "Add User"}
        </button>
        {defaultValues && (
          <button
            type="button"
            onClick={() => {
              reset();
              onResetEditing?.();
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default UserForm;
