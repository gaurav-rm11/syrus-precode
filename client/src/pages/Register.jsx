/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {toast} from "sonner"
import axiosClient from "../api/axios_client";
import { useDispatch } from 'react-redux';
import { login } from '../redux/slice/Userslice';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [otpValue, setOtpValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const checkOTP = async () => {
    try {
      const response = await axiosClient.get(`/user/verifyEmail`, {
        params: { otp: otpValue },
      });

      if (response.status === 200) {
        toast("Success", {
          description:
            "Your email has been successfully verified. Welcome aboard!",
          action: {
            label: "Close",
            onClick: () => console.log("Toast closed"),
          },
        });
        setIsDialogOpen(false)
        navigate('/welcome');
      } else {
        toast("Verification Failed", {
          description: "The OTP you entered is incorrect. Please try again.",
          action: {
            label: "Close",
            onClick: () => console.log("Toast closed"),
          },
        });
      }
    } catch (error) {
      toast("Error", {
        description:
          "Something went wrong while verifying your OTP. Please try again later.",
        action: {
          label: "Close",
          onClick: () => console.log("Toast closed"),
        },
      });
    }
  };


  // Handle Form Submission
  const handleSubmit = async () => {
    const { username, email, password, confirmPassword, role } = formData;

    if (password !== confirmPassword) {
      toast("Error", {
        description: "❌ Passwords do not match! Please check and try again.",
        action: {
          label: "Close",
          onClick: () => console.log("Toast closed"),
        },
      });
      return;
    }

    try {
      const response = await axiosClient.post("/user/signup", {
        name: username,
        email,
        password,
        role,
      });

      console.log("✅ Registration successful:", response.data);
      toast("Registration Successful", {
                description: "You have successfully registered on our platform.",
                action: { label: "Close" },
              });
      dispatch(login(response.data.user));
      localStorage.setItem("currentUser", JSON.stringify(response.data.user));
      setIsDialogOpen(true);
    } catch (error) {
      console.error(
        "❌ Registration failed:",
        error.response?.data || error.message
      );

      toast("Error", {
        description: `❌ ${
          error.response?.data?.message ||
          "Something went wrong! Please try again."
        }`,
        action: {
          label: "Close",
          onClick: () => console.log("Toast closed"),
        },
      });
    }
  };




  return (
    <div className="min-h-screen flex">
      {/* Left Side Info */}
      <div
        className="w-1/2 flex flex-col justify-center p-8"
        style={{ backgroundColor: "var(--orange-color)" }}
      >
        <div className="max-w-md mx-auto">
          <h1
            className="text-3xl font-bold mb-4 text-center"
            style={{ color: "var(--white-color)", whiteSpace: "break-word" }}
          >
              Join NiveshMitra: Empower Your Investments.
          </h1>
          <p className="text-base mb-4" style={{ color: "var(--white-color)" }}>
          Become part of a unified platform that consolidates market data, delivers
          real-time analytics, and fosters collaborative trading. Take the first
          step toward smarter investment decisions and secure financial insights.
          </p>
        </div>
      </div>

      {/* Registration Form */}
      <div
        className="w-1/2 p-8 flex flex-col justify-center"
        style={{ 
          backgroundColor: "var(--black-color)",
          color: "white"
         }}
      
      >
        <h2
          className="text-4xl mb-6 font-bold"
          style={{ color: "var(--white-color)" }}
        >
          Create your account
        </h2>

        <label
          className="block mb-2 text-sm font-medium"
          style={{ color: "var(--white-color)" }}
        >
          Username
        </label>
        <Input
          type="text"
          id="username"
          placeholder="Username"
          onChange={handleChange}
        />

        <label
          className="block mb-2 text-sm font-medium mt-4"
          style={{ color: "var(--white-color)" }}
        >
          Email
        </label>
        <Input
          type="email"
          id="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <label
          className="block mb-2 text-sm font-medium mt-4"
          style={{ color: "var(--white-color)" }}
        >
          Password
        </label>

        <Input
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <label
          className="block mb-2 text-sm font-medium mt-4"
          style={{ color: "var(--white-color)" }}
        >
          Confirm Password
        </label>

        <Input
          type="password"
          id="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
        />

        <label
          className="block mb-2 text-sm font-medium mt-4"
          style={{ color: "var(--white-color)" }}
        >
          Role
        </label>

        <Select
          onValueChange={(value) => setFormData({ ...formData, role: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          className="w-full py-2 mt-6 rounded text-sm font-semibold bg-[var(--orange-color)] text-[var(--white-color)]"
          onClick={handleSubmit}
        >
          Submit
        </Button>

        <div
          className="mt-4 text-center text-sm"
          style={{ color: "var(--white-color)" }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium hover:underline"
            style={{ color: "var(--orange-color)" }}
          >
            Login
          </a>
        </div>
      </div>

      {/* OTP Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[var(--black-color)] text-[var(--white-color)]">
          <DialogHeader>
            <DialogTitle>Registration Successfull. Enter OTP</DialogTitle>
            <DialogDescription>
              Please enter the one-time password sent to your email.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(value) => setOtpValue(value)}
            >
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <div className="text-center text-sm">
              {otpValue === "" ? (
                <>Enter your one-time password.</>
              ) : (
                <>You entered: {otpValue}</>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              onClick={checkOTP}
              className="bg-[var(--orange-color)]"
            >
              Submit OTP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;
