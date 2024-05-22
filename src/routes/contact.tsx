import {
  Form,
  useLoaderData,
  LoaderFunction,
  Params,
  useFetcher,
  useParams,
  ActionFunction,
} from "react-router-dom";
import { getContact, updateContact } from "../contacts";

export type ContactType = {
  id: string;
  first: string;
  last: string;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite: boolean;
};

type ContactNewType = {
  id: string;
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite?: boolean;
};

export type ContactLoaderData = {
  contact: ContactType | ContactNewType;
};

const action: ActionFunction = async ({ request, params }) => {
  //
  const formData = await request.formData();
  const contactId = params.contactId as string;
  const favoriteValue = formData.get("favorite") === "true";
  return updateContact(contactId, { favorite: favoriteValue });
};

const loader: LoaderFunction = async ({
  params,
}: {
  params: Params<string>;
}) => {
  const contactId = params.contactId as string;
  const contact = await getContact(contactId);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
    return { contact: { id: contactId } };
  }
  return { contact };
};

// export default function Contact(contact: Contact = defaultContact) {
export default function Contact() {
  const { contact } = useLoaderData() as ContactLoaderData;

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
  contact: ContactType | ContactNewType;
};

function Favorite(props: FavoriteProps) {
  const fetcher = useFetcher();
  let favorite = props.contact.favorite || false;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }
  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}

export { loader, action };
