export const downloadTxtFile = async (type, search, orgUid) => {
  await fetch(
    `http://localhost:3030/v1/${type}?${
      search === null || search === '' ? '' : `search=${search}&`
    }${orgUid === 'all' ? '' : `orgUid=${orgUid}&`}xls=true`,
  )
    .then(async result => await result.blob())
    .then(async response => {
      const filename = await response;
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(new Blob([filename]));
      link.href = url;
      link.download = `${type}.xlsx`;
      document.body.appendChild(link); // Required for this to work in FireFox
      link.click();
    });
};
