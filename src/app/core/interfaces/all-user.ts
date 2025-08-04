export interface AllUser {
  country: any,
  countryId: number,
  creationDate: string,
  departmentId: number,
  departmentName: string,
  email: string,
  id: number,
  imageUrl: string,
  isActivated: boolean,
  jobTitle: string,
  profileCV: {
    contentType: string,
    fileName: string,
    filePath: string,
    fileSize: number,
    fileType: number,
    id: number,
    taskGroupId: number
  },
  managerId: number,
  managerName: string,
  memberCode: string,
  name: string,
  phoneNumber: string,
  profileRoles: [
    {
      roleId: string,
      roleName: string,
    }
  ],
  spaceId: number,
  spaceAdmin: boolean,
  isSelected: boolean
}
