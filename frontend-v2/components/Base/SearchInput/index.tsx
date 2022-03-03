import React from 'react'
import Input from '../Input';
type Props = {
  [k: string]: any;
};

const SearchInput = ({ classes, ...props }: Props) => {
  return <div className='relative rounded-sm'>
    <span className='absolute left-3 top-2/4 w-4 h-4 z-50' style={{ transform: 'translate(0, -50%)' }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.6092 13.1123L10.6474 10.0318C11.409 9.12657 11.8262 7.98755 11.8262 6.80178C11.8262 4.03135 9.57221 1.77734 6.80178 1.77734C4.03135 1.77734 1.77734 4.03135 1.77734 6.80178C1.77734 9.57222 4.03135 11.8262 6.80178 11.8262C7.84184 11.8262 8.83297 11.5125 9.68035 10.917L12.6646 14.0208C12.7894 14.1504 12.9572 14.2218 13.1369 14.2218C13.3071 14.2218 13.4686 14.1569 13.5911 14.0389C13.8515 13.7884 13.8598 13.3729 13.6092 13.1123ZM6.80178 3.08807C8.84957 3.08807 10.5155 4.754 10.5155 6.80178C10.5155 8.84957 8.84957 10.5155 6.80178 10.5155C4.754 10.5155 3.08807 8.84957 3.08807 6.80178C3.08807 4.754 4.754 3.08807 6.80178 3.08807Z" fill="white" />
      </svg>
    </span>
    <Input placeholder='Search' {...props} classes={classes ? classes : { input: 'pl-9 rounded-sm' }} />
  </div>
}

export default SearchInput
