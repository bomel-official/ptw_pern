export type ModelData<
    TInstance extends { findByPk: ( ...args: any ) => any },
    TData extends Record<string, any>
> = Exclude<Awaited<ReturnType<TInstance["findByPk"]>>, null> & TData;
