/* eslint-disable react/prop-types */
import { follow, unfollow } from "./userApi";

// eslint-disable-next-line no-unused-vars
export default function FollowProfileButton({ following, onButtonClick }) {
  const followClick = () => {
    onButtonClick(follow);
  };

  const unfollowClick = () => {
    onButtonClick(unfollow);
  };

  return (
    <div className="my-2">
      {!following ? (
        <button
          onClick={followClick}
          className="mr-2 py-2 px-4 bg-blue-600 hover:bg-blue-800 text-slate-200 text-sm rounded-full shadow-sm"
        >
          Follow
        </button>
      ) : (
        <button
          onClick={unfollowClick}
          className="mr-2 py-2 px-4 bg-yellow-600 hover:bg-yellow-800 text-slate-200 text-sm rounded-full shadow-sm"
        >
          Unfollow
        </button>
      )}
    </div>
  );
}
