
export const dataSources = [
  'CDC_DATA_GOV',
  'WHO_GHO',
  'FENWAY_INSTITUTE',
  'THE_19TH_ARCHIVE'
];

export const getSourceLabel = (source: string): string => {
  switch (source) {
    case 'CDC_DATA_GOV':
      return 'CDC Data Portal';
    case 'WHO_GHO':
      return 'WHO Global Health Observatory';
    case 'FENWAY_INSTITUTE':
      return 'Fenway Institute Health Research';
    case 'THE_19TH_ARCHIVE':
      return 'The 19th Health Archive';
    default:
      return source;
  }
};
