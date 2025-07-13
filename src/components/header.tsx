import SearchRecipe from "./search-recipe";

export default function Header() {
  return (
    <div className="w-full flex flex-row item-center">
      <div className="flex flex-col items-start pr-4">
        <div className="text-3xl">
          Hello, <span className="font-bold text-black text-3xl">Name</span>
        </div>
        <div>You are achieving greatness</div>
      </div>
      <div className="flex-grow">
        <SearchRecipe />
      </div>
    </div>
  );
}
