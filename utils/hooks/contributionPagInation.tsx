export const usePagination = (
  page: number,
  setPage: { (page: number): void; (arg0: number): any },
  forms: any
) => {
  const nextPage = () => page <= 5 && setPage(page + 1);

  const prevPage = () => page > 0 && setPage(page - 1);

  const getForm = (page: number) => [...forms][page];

  const Form = getForm(page);

  const display = (
    <Form
      handleChangeFormPagePrev={prevPage}
      handleChangeFormPageNext={nextPage}
    />
  );

  return { page, display, prevPage };
};
