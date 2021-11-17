import request from "./http";

let imageHost = "http://research.genecast.com.cn/";
let imageHost2 = "https://gateway.genecast.com.cn/clever-research/";
let imagePreviewHost =
  "https://gateway.genecast.com.cn/clever-research/project/case/form/file/downLoad?filePath=";

if (process.env.NODE_ENV === "development") {
}
export { imageHost, imageHost2, imagePreviewHost };

/**
 * @description: 验证老密码
 * @param {*}
 * @return {*}
 */
export const checkOldPassword = params => {
  return request.post(`clever-oauth/checkOldPassword`, params);
};

/**
 * @description: 修改密码
 * @param {*}
 * @return {*}
 */
export const resetPassword = params => {
  return request.post(`clever-oauth/resetPassword`, params);
};

/**
 * @description: 验证码获取
 * @param {*}
 * @return {*}
 */
export const getCaptcha = params => {
  return request.get(`/captcha`, params, {
    responseType: "arraybuffer"
  });
};

/**
 * @description: publicKey获取
 * @param {*}
 * @return {*}
 */
export const getPublicKey = params => {
  return request.get(`/publicKey`, params);
};

/**
 * @description: 登录
 * @param {*}
 * @return {*}
 */
export const login = params => {
  return request.post(`/loginWithCaptcha`, params);
};

/**
 * @description: 获取病例元数据
 * @param {*}
 * @return {*}
 */
export const getDictionaryCaseMetadata = params => {
  return request.get(
    `/project/dictionary/caseMetadata/${params.projectId}`,
    params
  );
};

/**
 * @description: 获取课题病例分组
 * @param {*}
 * @return {*}
 */
export const getProjectArms = params => {
  return request.get(`/project/arms/${params.projectId}`);
};

/**
 * @description: 添加课题病例
 * @param {*}
 * @return {*}
 */
export const addProjectCase = params => {
  return request.post(`/project/case?cdrDataByVisit=false`, params);
};

/**
 * @description: 获取省市县字典
 * @param {*}
 * @return {*}
 */
export const getDictionaryChinaRegion = params => {
  return request.get(`/assets/china-region/china_region.json`, params);
};

/**
 * @description: 获取民族字典
 * @param {*}
 * @return {*}
 */
export const getDictionaryNation = params => {
  return request.get(`/dictionary/nation`, params);
};

/**
 * @description: 获取职业字典
 * @param {*}
 * @return {*}
 */
export const getDictionaryProfession = params => {
  return request.get(`/dictionary/profession`, params);
};

/**
 * @description: 获取关系字典
 * @param {*}
 * @return {*}
 */
export const getDictionaryRelation = params => {
  return request.get(`/dictionary/relation`, params);
};

/**
 * @description: 获取状态字典表根据状态实体类型
 * @param {*}
 * @return {*}
 */
export const getDictionaryStatus = params => {
  return request.get(`/dictionary/status`, params);
};

/**
 * @description: 根据课题id获取病例状态字典
 * @param {*}
 * @return {*}
 */
export const getDictionaryStatusListCase = params => {
  return request.get(`/dictionary/statusList/case`, params);
};

/**
 * @description: 修改病例基本信息
 * @param {*}
 * @return {*}
 */
export const patchMetadata = params => {
  return request.patch(`/case/metadata`, params);
};

/**
 * @description: 根据id获取病例元数据
 * @param {*}
 * @return {*}
 */
export const getMetadata = params => {
  return request.get(`/case/metadata/${params.caseId}`);
};

/**
 * @description: 病例附件接口
 * @param {*}
 * @return {*}
 */
export const postCaseAnnexdir = params => {
  return request.post(`/caseAnnex/dir`, params);
};

/**
 * @description: uploadCaseAnnex
 * @param {*}
 * @return {*}
 */
export const uploadCaseAnnex = params => {
  return request.post(`/file/batch/uploadCaseAnnex`, params);
};

/**
 * @description: deleteCaseAnnex
 * @param {*}
 * @return {*}
 */
export const deleteCaseAnnex = params => {
  return request.delete(`/file/caseAnnex`, params);
};

/**
 * @description: downLoadCaseAnnex
 * @param {*}
 * @return {*}
 */
export const downLoadCaseAnnex = params => {
  return request.delete(`/file/downLoadCaseAnnex`, params);
};

/**
 * @description: generateCaseAnnexKey
 * @param {*}
 * @return {*}
 */
export const getGenerateCaseAnnexKey = params => {
  return request.get(`/file/key`, params);
};

/**
 * @description: getCaseAnnexFilePath
 * @param {*}
 * @return {*}
 */
export const getCaseAnnexFilePath = params => {
  return request.get(`/file/path`, params);
};

/**
 * @description: 科研系统权限接口
 * @param {*}
 * @return {*}
 */
export const loadPermsOfList = params => {
  return request.get(`/loadPermsOfList`, params);
};

/**
 * @description: 删除事件
 * @param {*}
 * @return {*}
 */
export const deleteProjectEvent = params => {
  return request.delete(`/project/event/${params.eventId}`);
};

/**
 * @description: queryUserByUserId
 * @param {*}
 * @return {*}
 */
export const queryUserByUserId = params => {
  return request.get(`/project/oauth/user/${params.userId}`);
};

/**
 * @description: 根据课题id和用户id获取课题用户的权限信息
 * @param {*}
 * @return {*}
 */
export const queryAuthByProjectIdUserId = params => {
  return request.get(`/project/perm/${params.projectId}/${params.userId}`);
};

/**
 * @description: editRole
 * @param {*}
 * @return {*}
 */
export const editRole = params => {
  return request.put(`/project/role`);
};

/**
 * @description: 根据id获取课题
 * @param {*}
 * @return {*}
 */
export const getProject = params => {
  return request.get(`/project/${params.projectId}`);
};

/**
 * @description: 根据id获取课题首页卡片展示的课题各项统计信息
 * @param {*}
 * @return {*}
 */
export const getProjectHomeCount = params => {
  return request.get(`/project/home/count/${params.projectId}`);
};

/**
 * @description: 根据课题id获取病例年龄分布信息
 * @param {*}
 * @return {*}
 */
export const getDistributionAge = params => {
  return request.get(`/project/case/distribution/age/${params.projectId}`);
};

/**
 * @description: 根据课题id获取分中心收集病例数信息
 * @param {*}
 * @return {*}
 */
export const getDistributionCenterAmount = params => {
  return request.post(
    `/project/case/distribution/center/amount/${params.projectId}`,
    []
  );
};

/**
 * @description: 根据课题id获取病例性别分布信息
 * @param {*}
 * @return {*}
 */
export const getDistributionSex = params => {
  return request.get(`/project/case/distribution/sex/${params.projectId}`);
};

/**
 * @description: 根据课题id获取病例状态分布信息
 * @param {*}
 * @return {*}
 */
export const getDistributionStatus = params => {
  return request.get(`/project/case/distribution/status/${params.projectId}`);
};

/**
 * @description: 根据id获取课题病例
 * @param {*}
 * @return {*}
 */
export const getCaseById = params => {
  return request.get(`/project/case/${params.projectCaseId}`);
};

/**
 * @description: 上传病例表单附件
 * @param {*}
 * @return {*}
 */
export const uploadFileUrl = `/api/clever-research/project/case/form/file/upload`;

/**
 * @description: 获取当前用户的全部课题
 * @param {*}
 * @return {*}
 */
export const getProjectsList = params => {
  return request.get(`/projects/${params.userId}`);
};

/**
 * @description: 获取当前用户信息
 * @param {*}
 * @return {*}
 */
export const queryUserByUsername = params => {
  return request.get(`/project/user`, params);
};

/**
 * @description: 获取全部病例
 * @param {*}
 * @return {*}
 */
export const queryAllProjectCases = params => {
  return request.get(`/project/cases`, params);
};

/**
 * @description: 根据病例元数据id从cdr中获取当前表单的参考数据
 * @param {*}
 * @return {*}
 */
export const getFormInitDataByCdr = params => {
  return request.get(
    `/form/init/data/form-cdr-data/case-id/{byVisit}/{formId}/{caseId}/{pageIndex}`,
    params
  );
};

/**
 * @description: 获取课题中用于数据收集的表单
 * @param {*}
 * @return {*}
 */
export const getProjectForms = params => {
  return request.get(`/project/event/forms/${params.projectId}`);
};

/**
 * @description: 根据课题id得到该课题表单列表
 * @param {*}
 * @return {*}
 */
export const getProjectFormsAll = params => {
  return request.get(`/project/forms/${params.projectId}`);
};

/**
 * @description: 在启用病例分组、启用收集收集事件的前提下，获取病例分组的数据收集事件
 * @param {*}
 * @return {*}
 */
export const getProjectEventsArm = params => {
  return request.get(`/project/events/arm/${params.armId}`);
};

/**
 * @description: 在未启用病例分组、启用数据收集事件的前提下，获取课题数据收集事件(包含表单列表)
 * @param {*}
 * @return {*}
 */
export const getProjectEventsFormProject = params => {
  return request.get(`/project/events/forms/project/${params.projectId}`);
};

/**
 * @description: 获取表单树
 * @param {*}
 * @return {*}
 */
export const getProjectFormTree = params => {
  return request.get(
    `/project/form/controls/tree/${params.projectId}/${params.formId}`
  );
};

/**
 * @description: 获取表单树对应的数据
 * @param {*}
 * @return {*}
 */
export const getFormData = params => {
  return request.get(`/project/case/form/data/${params.formDataId}`, {
    projectId: params.projectId
  });
};

// 👇start👇 如果必填项都填写完成，则提示用户是否将表单标记为已完成，如果点是  则调用完整的数据接口
/**
 * @description: 首次录入课题病例完整的表单数据 ↑
 * @param {*}
 * @return {*}
 */
export const patchFormDataEntryComplete = params => {
  return request.patch(
    `/project/case/form/data/entry/complete/${params.projectCaseFormId}/${params.projectId}/${params.operatorId}?formId=${params.formId}`,
    params.formItemData
  );
};

/**
 * @description: 首次录入课题病例不完整的表单数据 ↑
 * @param {*}
 * @return {*}
 */
export const patchFormDataEntryIncomplete = params => {
  return request.patch(
    `/project/case/form/data/entry/incomplete/${params.projectCaseFormId}/${params.projectId}/${params.operatorId}?formId=${params.formId}`,
    params.formItemData
  );
};

/**
 * @description: 修改课题病例表单数据 ↑
 * @param {*}
 * @return {*}
 */
export const patchFormData = params => {
  return request.patch(
    `/project/case/form/data/modify/${params.projectCaseFormId}/${params.projectId}/${params.operatorId}?formId=${params.formId}`,
    params.formItemData
  );
};

/**
 * @description: 修改课题病例不完整的表单数据 ↑
 * @param {*}
 * @return {*}
 */
export const patchFormDataIncomplete = params => {
  return request.patch(
    `/project/case/form/data/modify/incomplete/${params.projectCaseFormId}/${params.projectId}/${params.operatorId}?formId=${params.formId}`,
    params.formItemData
  );
};

/**
 * @description: 修改课题病例完整的表单数据 ↑
 * @param {*}
 * @return {*}
 */
export const patchFormDataComplete = params => {
  return request.patch(
    `/project/case/form/data/modify/complete/${params.projectCaseFormId}/${params.projectId}/${params.operatorId}?formId=${params.formId}`,
    params.formItemData
  );
};

// 👆end👆

/**
 * @description: 添加课题病例表单映射关系
 * @param {*}
 * @return {*}
 */
export const insertForm = params => {
  return request.post(
    `/project/case/form?operatorId=${params.operatorId}`,
    params
  );
};

/**
 * @description: 移除课题病例表单映射关系
 * @param {*}
 * @return {*}
 */
export const deleteForm = params => {
  return request.delete(
    `/project/case/form/${params.projectId}/${params.operatorId}/${params.projectCaseFormId}`
  );
};

/**
 * @description: 在启用数据收集事件的前提下，获取课题病例当前事件实例的表单信息
 * @param {*}
 * @return {*}
 */
export const getCaseEventList = params => {
  return request.get(
    `/project/case/forms/event/${params.projectEventId}/${params.projectCaseEventId}/${params.projectCaseId}`
  );
};

/**
 * @description: 验证事件实例是否结束
 * @param {*}
 * @return {*}
 */
export const projectCaseEventInstanceValidate = params => {
  return request.post(
    `/project/case/event/instance/validate/${params.projectCaseEventId}/${params.belongEventId}/${params.eventInstanceNo}/${params.projectCaseId}/${params.projectEventFormId}/${params.projectCaseFormId}/${params.projectId}?offset=`,
    params.formItemData
  );
};

/**
 * @description: 根据id获取课题病例表单映射关系
 * @param {*}
 * @return {*}
 */
export const getFormStatus = params => {
  return request.get(`/project/case/form/${params.projectCaseFormId}`);
};

/**
 * @description: 验证是否需要刷新事件实例
 * @param {*}
 * @return {*}
 */
export const refreshDateValidate = params => {
  return request.get(
    `/project/validate/event/instance/refresh?projectCaseFormId=${params.projectCaseFormId}&projectId=${params.projectId}`
  );
};

/**
 * @description: 重新生成绑定了开始日期的事件实例
 * @param {*}
 * @return {*}
 */
export const refreshDateBind = params => {
  return request.post(
    `/project/case/event/refresh?projectCaseFormId=${params.projectCaseFormId}&projectId=${params.projectId}&userId=${params.userId}`
  );
};

/**
 * @description: 检验事件表单规则，判断表单是否需要填写
 * @param {*}
 * @return {*}
 */
export const formValidate = params => {
  return request.post(
    `/project/event/form/rules/validate/${params.projectCaseId}`,
    params.currentForm
  );
};

/**
 * @description: 跨表单控制控件隐藏显示
 * @param {*}
 * @return {*}
 */
export const queryFormItemDisplay = params => {
  return request.post(
    `/project/case/cross/form/logic/rule?projectId=${params.projectId}&projectCaseId=${params.projectCaseId}`
  );
};
