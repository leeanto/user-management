import React, { useEffect, useState, useRef } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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

  const stateValue = watch("state");

  // Filter states based on search term
  const filteredStates = STATES.filter(state => 
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    setSearchTerm("");
  };

  const handleStateSelect = (state: string) => {
    setValue("state", state);
    setSearchTerm("");
    setShowDropdown(false);
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-4 w-full max-w-md md:max-w-xl p-3 sm:p-4 border rounded-xl shadow-md bg-white mx-auto"
    >
      <div>
        <label className="block font-semibold text-sm sm:text-base">Name</label>
        <input 
          {...register("name")} 
          className="w-full border px-3 py-1 sm:py-2 rounded text-sm sm:text-base" 
        />
        {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block font-semibold text-sm sm:text-base">Age</label>
        <input 
          type="number" 
          {...register("age")} 
          className="w-full border px-3 py-1 sm:py-2 rounded text-sm sm:text-base" 
        />
        {errors.age && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.age.message}</p>}
      </div>

      <div>
        <label className="block font-semibold text-sm sm:text-base">Gender</label>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {["Male", "Female", "Other"].map((g) => (
            <label key={g} className="flex items-center text-sm sm:text-base">
              <input 
                type="radio" 
                value={g} 
                {...register("gender")} 
                className="mr-2" 
              />
              {g}
            </label>
          ))}
        </div>
        {errors.gender && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.gender.message}</p>}
      </div>

      <div>
        <label className="block font-semibold text-sm sm:text-base">State</label>
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center border rounded">
            <input
              type="text"
              placeholder="Search for a state..."
              value={showDropdown ? searchTerm : stateValue}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!showDropdown) setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full px-3 py-1 sm:py-2 rounded text-sm sm:text-base flex-1 border-0"
            />
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-2 text-gray-500 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          
          {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredStates.length === 0 ? (
                <div className="px-4 py-2 text-gray-500 text-sm">No matching states found</div>
              ) : (
                filteredStates.map((state) => (
                  <div
                    key={state}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                      state === stateValue ? "bg-blue-100" : ""
                    }`}
                    onClick={() => handleStateSelect(state)}
                  >
                    {state}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        {errors.state && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.state.message}</p>}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button 
          type="submit" 
          className="bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base"
        >
          {defaultValues ? "Update User" : "Add User"}
        </button>
        {defaultValues && (
          <button
            type="button"
            onClick={() => {
              reset();
              onResetEditing?.();
              setSearchTerm("");
            }}
            className="bg-gray-400 text-white px-3 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default UserForm;