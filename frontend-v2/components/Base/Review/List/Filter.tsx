type ReviewListFilterProps = {
  ratingLevel: string;
  setRatingLevel: (val: string) => any;
}

const ReviewListFilter = ({
  ratingLevel,
  setRatingLevel
}: ReviewListFilterProps) => {
  const onChangeRatingLevel = e => setRatingLevel(e.target.value)

  return (
    <div className="flex items-center justify-start gap-2">
      <p className="font-casual text-sm text-right">
        <select
          value={ratingLevel}
          onChange={onChangeRatingLevel}
          className="mr-2 font-casual text-sm w-full md:w-auto bg-gamefiDark-800 border-gamefiDark-600 rounded py-1 leading-6 shadow-lg"
        >
          <option value="">All rating level</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </p>
    </div>
  )
}

export default ReviewListFilter
