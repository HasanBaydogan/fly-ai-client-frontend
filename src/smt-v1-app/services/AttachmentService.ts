import { getRequest } from './ApiCore/GlobalApiCore';

export const openAttachment = async (attachmentId: string) => {
  return await getRequest(`/attachment/id/${attachmentId}`);
};
