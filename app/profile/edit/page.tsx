"use client";

import Icon from "@/components/ui/Icon";
import { useUserProfileContext } from "@/context/userProfile";
import { setUsernameApi } from "@/utils/api";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

export const Wallet: FC<{ address: string; isActive: boolean }> = ({
  address,
  isActive,
}) => {
  return (
    <div className="p-4 flex bg-gray40 border-2 border-gray50 rounded-lg">
      <span>
        <img src="/assets/images/up-profile/dot.svg" alt="dot" />
      </span>
    </div>
  );
};

const EditPage = () => {
  const { userProfile, updateUsername, userToken } = useUserProfileContext();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    if (!userToken) return;
    setError("");
    setLoading(true);
    try {
      await setUsernameApi(username, userToken);
      updateUsername(username);
    } catch (e) {
      if (!(e instanceof AxiosError) || !e.response) return;
      setError(e.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile?.username) {
      setUsername(userProfile?.username);
    }
  }, [userProfile?.username]);

  useEffect(() => {
    setError("");
  }, [username]);

  return (
    <div>
      <div className="bg-gray20 mt-10 rounded-xl p-5 flex items-center">
        <Link href="/profile" className="mr-auto">
          <Icon iconSrc="/assets/images/up-profile/back.svg" />
        </Link>
        <h4 className="mr-auto">Edit Profile</h4>
      </div>

      <div className="mt-5 p-5 flex bg-cover rounded-xl items-center bg-[url('/assets/images/up-profile/profile-landing.svg')] gap-10">
        <Image
          src="/assets/images/landing/profile-img.svg"
          alt="profile-unitap"
          width={64}
          height={79}
        />

        <div>
          <div className="relative">
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`border border-solid w-72 px-4 py-3 rounded-xl bg-gray50 ${
                error ? "border-error" : "border-gray70"
              }`}
            />
            <button
              disabled={username === userProfile?.username || loading}
              onClick={onSubmit}
              className="absolute right-3 disabled:opacity-60 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#4bf2a229] via-[#e1c3f44f] to-[#dd40cd4f] rounded-lg px-3 py-1"
            >
              {loading ? "Loading" : "Save"}
            </button>
          </div>
          {!!error && <p className="text-xs pl-2 text-error">{error}</p>}
        </div>
      </div>

      <div className="mt-5 bg-gray20 rounded-xl p-5">
        <p>
          Wallets <small className="text-gray90">(0/10)</small>
        </p>

        <div className="mt-10">
          <div className="grid grid-cols-2 gap-4"></div>

          <button
            className="w-72 px-5 mt-5 py-4 flex items-center rounded-xl border-2 border-gray70"
            type="button"
          >
            <span className="ml-auto text-sm font-semibold">
              {" "}
              Add New Wallet
            </span>
            <span className="ml-auto">
              <Image
                width={16}
                height={16}
                src="/assets/images/up-profile/plus.svg"
                alt="plus"
                className="w-[16px] h-[16px]"
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
