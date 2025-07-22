import { signOut } from "@/auth";
import BookLIst from "@/components/BookLIst";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/constants";
import React from "react";

export default function MyProfile() {
  return (
    <>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
        className="mb-10"
      >
        <Button>Logout</Button>
      </form>

      <BookLIst title="Borrowed Books" books={sampleBooks} />
    </>
  );
}
