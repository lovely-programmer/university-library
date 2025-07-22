import BookLIst from "@/components/BookLIst";
import BookOverview from "@/components/BookOverview";
import { sampleBooks } from "@/constants";

export default async function Home() {
  // const result = await db.select().from(usersTable);

  return (
    <div>
      <BookOverview {...sampleBooks[0]} />
      <BookLIst
        title="Latest Books"
        books={sampleBooks}
        containerClassName="mt-28"
      />
    </div>
  );
}
