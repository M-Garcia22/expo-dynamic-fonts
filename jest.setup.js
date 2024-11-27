global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    text: () => Promise.resolve('url(https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2)'),
  })
); 