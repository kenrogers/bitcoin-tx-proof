export const proofToBuffers = (proof: string): Buffer[] => {
  const chunks = proof.match(/.{1,64}/g);
  return chunks?.map(c => Buffer.from(c, 'hex')) || [];
};
