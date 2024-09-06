import Link from "next/link";
import { LinkIt, LinkItUrl } from "react-linkify-it";
import LinkifyUsernameTooltip from "./LinkifyUsernameTooltip";

interface LinkifyProps {
  children: React.ReactNode;
}

const Linkify = ({ children }: LinkifyProps) => {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  );
};

export default Linkify;

function LinkifyUrl({ children }: LinkifyProps) {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  );
}

function LinkifyUsername({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/@[a-zA-Z0-9_-]+/}
      component={(match: string, key: number) => {
        const username = match.slice(1);

        return (
          <LinkifyUsernameTooltip key={key} username={username}>
            {match}
          </LinkifyUsernameTooltip>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}

function LinkifyHashtag({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/#[a-zA-Z0-9_-]+/}
      component={(match: string, key: number) => {
        const hashtag = match.slice(1);

        return (
          <Link
            key={key}
            href={`/hashtags/${hashtag}`}
            className="text-primary hover:underline"
          >
            {match}
          </Link>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}
