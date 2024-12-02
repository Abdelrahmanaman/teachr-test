import Link from "next/link";
import { Fragment, FunctionComponent } from "react";

interface ReferenceItem {
  href: string;
  name: string | undefined; // Updated to allow undefined
}

interface Props {
  items: string | string[] | ReferenceItem | ReferenceItem[]; // Updated interface
}

const ReferenceLinks: FunctionComponent<Props> = ({ items }) => {
  if (Array.isArray(items)) {
    return (
      <Fragment>
        {items.map((item, index) => (
          <div key={index}>
            <ReferenceLinks items={item} />
          </div>
        ))}
      </Fragment>
    );
  }

  if (typeof items === "string") {
    return (
      <Link href={items} className="text-cyan-700 font-bold">
        {items}
      </Link>
    );
  }

  const { href, name } = items as ReferenceItem;
  return (
    <Link href={href} className="text-cyan-700 font-bold">
      {name || href} {/* Fallback to href if name is undefined */}
    </Link>
  );
};

export default ReferenceLinks;
