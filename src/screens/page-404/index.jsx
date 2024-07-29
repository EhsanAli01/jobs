import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";

const Page404 = () => {
  const navigate = useNavigate();
  return (
    <section class="bg-gray-200 min-h-screen flex flex-col justify-center items-center">
      <div class="py-8 px-4 mx-auto max-w-screen-xl">
        <div class="mx-auto max-w-screen-sm text-center">
          <h1 class="mb-4 text-7xl tracking-tight text-gray-600 font-extrabold text-primary-600">
            404
          </h1>
          <p class="mb-4 text-3xl tracking-tight font-bold text-gray-600">
            Page Not Found
          </p>
          <p class="mb-4 text-lg font-light text-gray-500">
            Sorry, we can't find that page. Wanna go back to the home page?
          </p>

          <Button
            label="Back to Homepage"
            color="primary"
            type="button"
            click={() => navigate("/")}
            sty="w-[250px] mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Page404;
