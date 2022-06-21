import clsx from 'clsx'
import styles from '@/components/Pages/Account/Review/account_review.module.scss'
import { printNumber, fetcher } from '@/utils'
import { useMemo, useState } from 'react'
import get from 'lodash.get'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from '@/components/Base/Modal'
import Image from 'next/image'
import useConnectWallet from '@/hooks/useConnectWallet'
import Avatar from '@/components/Pages/Hub/Reviews/Avatar'
import { useRouter } from 'next/router'
import { useScreens } from '@/components/Pages/Home/utils'
import { API_CMS_URL } from '@/utils/constants'
import Loading from '@/components/Pages/Hub/Loading'

const VALID_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

function UserProfile ({ editable = false, data, totalReviewOfAllStatus = 0 }) {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tempAvatar, setTempAvatar] = useState(get(data, 'avatar.url') || '')
  const { connectWallet } = useConnectWallet()
  const { firstName, lastName, avatar: defaultAvatar } = data || {}
  const _originFirstName = firstName
  const _originLastName = lastName
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset
  } = useForm({
    defaultValues: {
      avatar: tempAvatar,
      firstName: firstName,
      lastName: lastName
    }
  })
  // const watchAvatar = watch('avatar', avatar?.url)

  const router = useRouter()
  const screens = useScreens()

  const fullName = useMemo(() => {
    let fullName = ''
    const firstName = get(data, 'firstName')
    const lastName = get(data, 'lastName')
    const walletAddress = get(data, 'walletAddress')
    if (firstName) {
      fullName += firstName
    }
    if (lastName) {
      fullName += ` ${lastName}`
    }
    fullName = fullName.trim()
    if (!fullName) {
      fullName = `Anonymous-${walletAddress?.slice(-5)}`
    }

    return fullName
  }, [data])

  const txtRankAndLevel = useMemo(() => {
    let _txt = ''

    if (data?.rank) {
      _txt += data?.rank
    }

    if (data.level) {
      _txt += _txt ? ` - Level ${data?.level}` : `Level ${data?.level}`
    }

    return _txt || ''
  }, [data?.level, data?.rank])
  const isMyAccountReview = router.route === '/account/review'
  const totalReviews = isMyAccountReview
    ? totalReviewOfAllStatus
    : get(data, 'reviewCount') || 0

  const handleToggleModal = () => {
    const isShow = !showModal
    if (isShow) {
      handleClearTempAvatar()
      reset({ firstName: _originFirstName, lastName: _originLastName })
    }
    setShowModal(isShow)
  }
  const onSubmit = (dataSubmit) => {
    if (loading) return
    setLoading(true)
    connectWallet().then(async (res: any) => {
      if (res.error) {
        setLoading(false)
        toast.error('Could not update info')
        return
      }
      try {
        const { firstName, lastName, avatar } = dataSubmit
        const { walletAddress, signature } = res
        let avatarId = get(defaultAvatar, 'id', null)
        if (avatar?.length) {
          const formData = new FormData()
          formData.append('files', avatar[0])
          const responseUpload = await fetcher(`${API_CMS_URL}/api/upload`, {
            method: 'POST',
            body: formData,
            headers: {
              'X-Signature': signature,
              'X-Wallet-Address': walletAddress
            }
          })
          if (responseUpload && responseUpload.length) {
            const newAvatarId = get(responseUpload, '[0].id')
            if (newAvatarId) {
              avatarId = newAvatarId
            }
          }
        }

        const payload = { firstName, lastName, avatar: avatarId }

        const response = await fetcher('/api/hub/profile/update', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'X-Signature': signature,
            'X-Wallet-Address': walletAddress
          }
        })

        setLoading(false)
        if (response?.error) {
          toast.error('Could not update info')
        } else {
          setShowModal(false)
          router.reload()
          toast.success('update successfully')
        }
      } catch (err) {
        setLoading(false)
        toast.error(err.message || 'Could not update info')
      }
    }).catch(err => {
      setLoading(false)
      toast.error(err?.toString() || 'Could not sign the authentication message')
    })
  }

  const handleUpdate = () => {
    handleSubmit(onSubmit)()
  }
  const handleUploadAvatar = () => {
    const elm = document.getElementById('uploadAvatarInput') as HTMLInputElement
    if (!elm) return
    const file = elm.files[0]
    if (!file) return
    if (!VALID_MIME_TYPES.includes(file.type)) return toast.error('Invalid image type')

    setTempAvatar(URL.createObjectURL(file))
  }

  const handleOnDrop = (e) => {
    e.preventDefault()

    const files = e.dataTransfer.files
    if (Array.isArray(files) && files.length > 1) return

    const [file] = files
    if (!VALID_MIME_TYPES.includes(file.type)) return toast.error('Invalid image type')

    setTempAvatar(URL.createObjectURL(file))
    setValue('avatar', files)
  }

  const handleClearTempAvatar = () => {
    if (loading) return
    setTempAvatar(null)
    const elm = document.getElementById('uploadAvatarInput') as HTMLInputElement
    if (!elm) return
    elm.value = null
  }

  const onToggleModal = val => {
    if (loading) return
    if (val !== null || val !== undefined) {
      setShowModal(val)
    } else {
      setShowModal(!showModal)
    }
  }

  return (
    <div
      className={clsx(
        styles.profile,
        'w-full rounded-[4px] p-2 md:p-4 flex gap-[28px] overflow-hidden relative'
      )}
    >
      <div
        className={clsx(
          styles.avatar,
          'rounded-[3px] w-[60px] h-[60px] md:w-[164px] md:h-[164px] overflow-hidden'
        )}
      >
        <Avatar
          size={!screens.mobile || !screens.tablet ? 164 : 60}
          url={get(data, 'avatar.url', '')}
        />
      </div>
      <div className={clsx(styles.info, 'flex justify-center flex-col')}>
        <div className="font-casual not-italic font-semibold md:text-base text-sm leading-[100%] tracking-[0.03px] text-white mb-[8px] md:mb-[10px]">
          {fullName}
        </div>
        <div className="font-casual font-medium text-[13px] md:text-sm leading-[100%] text-white opacity-60 mb-2 md:mb-[34px]">
          {txtRankAndLevel}
        </div>
        {(!screens.mobile || !screens.tablet) && (
          <div className="flex gap-[10px]">
            <div className="w-4 h-4">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 0H15C15.552 0 16 0.448 16 1V11C16 11.552 15.552 12 15 12H10L4 16V12H1C0.448 12 0 11.552 0 11V1C0 0.448 0.448 0 1 0Z"
                  fill="#53545A"
                />
              </svg>
            </div>
            <div className="font-casual font-semibold not-italic text-[13px] leading-[12px] text-white">{`${printNumber(
              totalReviews
            )} ${totalReviews > 1 ? 'Reviews' : 'Review'}`}</div>
          </div>
        )}
      </div>
      {editable && (
        <button
          onClick={handleToggleModal}
          className="flex items-center absolute top-4 right-4 gap-2 cursor-pointer uppercase font-bold font-[13px] leading-[150%] tracking-[0.02em] text-gamefiGreen-700 mr-0 md:mr-8 hover:opacity-90"
        >
          <Image
            src={require('@/assets/images/hub/pencil.svg')}
            alt="button_edit"
          ></Image>
          <span className="font-mechanic font-bold text-[13px] leading-[150%] tracking-[0.02em] text-gamefiGreen-600">
            Edit Profile
          </span>
        </button>
      )}
      <Modal
        show={showModal}
        toggle={onToggleModal}
        className="dark:bg-transparent fixed z-50"
      >
        <div className="bg-gamefiDark-700">
          <div className="p-4 md:p-8 pt-10 text-white">
            <div className="uppercase font-bold text-2xl mb-8">
              Update Profile
            </div>
            <form
              className="w-full m-auto pb-2 md:pb-8"
              // onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col md:flex-row gap-10">
                <div className="mx-auto md:mx-0 w-[150px] h-[150px] md:w-[237px] md:h-[237px] relative">
                  <div className="flex items-center justify-center w-full h-full">
                    <div
                      className={clsx(
                        'flex flex-col items-center justify-center w-full h-full border border-[#3A3A40] bg-[#303035]',
                        tempAvatar
                          ? ''
                          : 'border-dashed hover:border-gamefiGreen-700'
                      )}
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.2">
                          <path
                            d="M16.6667 24.6673C20.3486 24.6673 23.3333 21.6825 23.3333 18.0007C23.3333 14.3188 20.3486 11.334 16.6667 11.334C12.9848 11.334 10 14.3188 10 18.0007C10 21.6825 12.9848 24.6673 16.6667 24.6673Z"
                            stroke="white"
                            strokeMiterlimit="10"
                            strokeLinecap="square"
                          />
                          <path
                            d="M28.6667 30.0006H4.66667C3.95942 30.0006 3.28115 29.7197 2.78105 29.2196C2.28095 28.7195 2 28.0412 2 27.334V10.0007C2 9.29341 2.28095 8.61513 2.78105 8.11503C3.28115 7.61494 3.95942 7.33398 4.66667 7.33398H10L12.6667 3.33398H20.6667L23.3333 7.33398H28.6667C29.3739 7.33398 30.0522 7.61494 30.5523 8.11503C31.0524 8.61513 31.3333 9.29341 31.3333 10.0007V27.334C31.3333 28.0412 31.0524 28.7195 30.5523 29.2196C30.0522 29.7197 29.3739 30.0006 28.6667 30.0006Z"
                            stroke="white"
                            strokeMiterlimit="10"
                            strokeLinecap="square"
                          />
                          <path
                            d="M5.99935 12.6667C6.73573 12.6667 7.33268 12.0697 7.33268 11.3333C7.33268 10.597 6.73573 10 5.99935 10C5.26297 10 4.66602 10.597 4.66602 11.3333C4.66602 12.0697 5.26297 12.6667 5.99935 12.6667Z"
                            fill="white"
                          />
                        </g>
                      </svg>

                      <div className="text-center pt-2 md:pt-5 font-casual text-xs md:text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                        <span className="text-gamefiGreen-700">Browse </span>
                        your avatar or drag and drop image here
                      </div>
                      <input
                        id="uploadAvatarInput"
                        className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer "
                        name="avatar"
                        type="file"
                        {...register('avatar')}
                        onChange={handleUploadAvatar}
                        onDrop={handleOnDrop}
                      />
                      {!!tempAvatar && (
                        <div className="absolute">
                          <img src={tempAvatar} alt="" />
                          <svg
                            className={clsx('cursor-pointer absolute top-4 right-4', tempAvatar ? 'visible' : 'invisible')}
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={handleClearTempAvatar}
                          >
                            <path
                              d="M2.5 5.5L3.365 14.149C3.40194 14.5191 3.57507 14.8623 3.85076 15.1119C4.12646 15.3615 4.48507 15.4999 4.857 15.5H11.143C11.5149 15.4999 11.8735 15.3615 12.1492 15.1119C12.4249 14.8623 12.5981 14.5191 12.635 14.149L13.5 5.5"
                              stroke="#6CDB00"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M0.5 3.5H15.5"
                              stroke="#6CDB00"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M5.5 3.5V0.5H10.5V3.5"
                              stroke="#6CDB00"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="uppercase text-[13px] font-bold mb-6">
                    Your Info
                  </div>
                  <div className="">
                    <div className="mb-6">
                      <div className="text-sm mb-2 font-casual text-gamefiDark-350 text-[13px]">
                        First Name *
                      </div>
                      <input
                        className="bg-[#303035] border border-[#3C3C42] placeholder-white placeholder-opacity-30 font-casual text-sm rounded-sm px-4 py-2 w-full focus-visible:border-gamefiDark-350"
                        name="firstName"
                        placeholder="Your First Name"
                        autoFocus
                        maxLength={100}
                        {...register('firstName', {
                          required: true,
                          minLength: 0,
                          maxLength: 50
                        })}
                      />
                      {errors.firstName && (
                        <div className="mt-2 text-normal text-red-500 ">
                          First Name is required
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      <div className="text-sm mb-2 font-casual text-gamefiDark-350 text-[13px]">
                        Last Name *
                      </div>
                      <input
                        className="bg-[#303035] border border-[#3C3C42] placeholder-white placeholder-opacity-30 font-casual text-sm rounded-sm px-4 py-2 w-full focus-visible:border-gamefiDark-350"
                        name="lastName"
                        placeholder="Your Last Name"
                        {...register('lastName', {
                          required: true,
                          minLength: 0,
                          maxLength: 50
                        })}
                      />
                      {errors.lastName && (
                        <div className="mt-2 text-normal text-red-500 ">
                          Last Name is required
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="flex justify-end h-9">
              <button
                className="font-mechanic text-white/50 hover:text-gamefiGreen-200 clipped-b-l py-2 px-7 rounded leading-5 font-bold text-sm"
                onClick={handleToggleModal}
                disabled={loading}
              >
                CANCEL
              </button>
              <button
                className="w-36 overflow-hidden px-8 bg-gamefiGreen-700 text-gamefiDark-900 font-bold text-[13px] rounded-xs hover:opacity-95 cursor-pointer rounded-sm clipped-t-r "
                onClick={handleUpdate}
                disabled={loading}
              >
                UPDATE
                { loading && <Loading/>}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default UserProfile
