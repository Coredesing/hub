import clsx from 'clsx'

const Loading = ({ isPart, className }: any) => (
  isPart
    ? (
      <div className={clsx(className, 'loader-wrapper mx-auto h-full w-full top-0 left-0 absolute z-10')}>
        <svg className="loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </div>
    )
    : (
      <div className={clsx(className, 'fixed flex gap-2 justify-center items-center uppercase font-casual font-semibold z-10 inset-0 bg-gamefiDark-900 bg-opacity-90')}>
        <svg
          className="animate-spin w-8 h-8"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            className="opacity-25"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading...
      </div>
    )
)

export default Loading
