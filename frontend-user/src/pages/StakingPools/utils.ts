export const handleErrMsg = (err: any) => {
    const message = err?.data?.message || '';
    if(message.includes('invalid new pool')) {
        return 'Cannot switch to this pool.';
    }
    return '';
}