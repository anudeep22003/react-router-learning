import {
  Outlet,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  NavLink,
} from "react-router-dom";
import { createContact, getContacts } from "../contacts";
import { ContactType } from "./contact";

type LoaderData = {
  contacts: ContactType[];
};

const loader = async () => {
  const contacts: ContactType[] = await getContacts();
  return { contacts };
};

type ContactCreateType = {
  id: string;
  createdAt: number;
};

// type ActionData = {
//   contact: ContactCreateType;
// };

const action = async () => {
  const contact: ContactCreateType = await createContact();
  // return { contact };
  return redirect(`/contacts/${contact.id}/edit`);
};

function Root() {
  // navigation.state: "idle" | "submitting" | "loading"
  const navigation = useNavigation();
  const { contacts } = useLoaderData() as LoaderData;
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>No contacts found</p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}

export default Root;
export { loader, action };
