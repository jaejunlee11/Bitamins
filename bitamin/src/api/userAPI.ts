import axiosInstance from './axiosInstance'

export const fetchUserInfo = async () => {
  try {
    const response = await axiosInstance.get('members/get-member')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch user information')
  }
}

export const updateUserInfo = async (userInfo: any) => {
  try {
    const memberUpdateRequestDTO = {
      email: userInfo.email,
      name: userInfo.name,
      nickname: userInfo.nickname,
      birthday: userInfo.birthday,
      sidoName: userInfo.sidoName,
      gugunName: userInfo.gugunName,
      dongName: userInfo.dongName,
      // 필요한 다른 필드들 추가
    }

    const formData = new FormData()
    formData.append(
      'memberUpdateRequestDTO',
      new Blob([JSON.stringify(memberUpdateRequestDTO)], {
        type: 'application/json',
      })
    )
    if (userInfo.profileImage) {
      formData.append('profileImage', userInfo.profileImage)
    }

    const response = await axiosInstance.put(
      '/members/update-member',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data
  } catch (error) {
    console.error('Error response:', error.response)
    throw new Error('Failed to update user info')
  }
}
