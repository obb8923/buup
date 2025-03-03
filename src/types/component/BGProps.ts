
export const BGProps = {
    GRADATION: 'gradation',
    SOLID: 'solid',
    MAIN: 'main',
  } as const;
  
  export type BGProps = (typeof BGProps)[keyof typeof BGProps];