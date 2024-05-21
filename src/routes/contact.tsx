import { Form, useLoaderData, LoaderFunction, Params } from "react-router-dom";
import { getContact } from "../contacts";

export type ContactType = {
  id: string;
  first: string;
  last: string;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite: boolean;
};

type LoaderData = {
  contact: ContactType | null;
};

const loader: LoaderFunction = async ({
  params,
}: {
  params: Params<string>;
}) => {
  const contactId = params.contactId as string;
  const contact = await getContact(contactId);
  return { contact };
};

// export default function Contact(contact: Contact = defaultContact) {
export default function Contact() {
  let { contact } = useLoaderData() as LoaderData;

  if (!contact) {
    contact = {
      id: "",
      first: "",
      last: "",
      avatar: "",
      twitter: "",
      notes: "",
      favorite: false,
    };
  }

  // const contact: ContactType = {
  //   id: "0",
  //   first: "Your",
  //   last: "Name",
  //   avatar: "https://picsum.photos/id/1/200/200",
  //   twitter: "your_handle",
  //   notes: "Some notes",
  //   favorite: true,
  // };
  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar || undefined} />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

type FavoriteProps = {
  contact: ContactType;
};

function Favorite(props: FavoriteProps) {
  // yes, this is a `let` for later
  const favorite = props.contact.favorite;
  return (
    <Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
}

export { loader };
