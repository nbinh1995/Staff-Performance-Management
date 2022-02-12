import React, {useEffect} from 'react';

import {
    Card,
    CardHeader,
    Table,
    CardFooter,
    Pagination,
    PaginationItem,
    PaginationLink,
    Col,
    Label,
    Input,
    Row,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
} from 'reactstrap';

import NoDataFound from "../NoDataFound/NoDataFound";

import {useTable, usePagination, useSortBy, useGlobalFilter} from 'react-table';
import _ from "lodash";

export default function DataTable({
                                      name = null,
                                      columns,
                                      data,
                                      pageCount: controlledPageCount,
                                      onChange = () => {
                                      },
                                      onSort = () => {
                                      },
                                      onPaging = () => {
                                      },
                                      currentPage = 1,
                                      showPageInfo = false,
                                      showFilter = false,
                                      showAddBtn = false,
                                      DOMBtnAdd = null,
                                      showCard = true,
                                      textSmall = false,
                                      noPadding = false,
                                  }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        // pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setGlobalFilter,
        // setPageSize,
        state: {pageIndex, sortBy, globalFilter},
    } = useTable(
        {
            columns,
            data,
            initialState: {pageIndex: currentPage - 1},
            manualPagination: true,
            pageCount: controlledPageCount,
            manualSortBy: true,
            manualGlobalFilter: true,
        },
        useGlobalFilter,
        useSortBy,
        usePagination,
    )

    useEffect(() => {
        onSort(sortBy);
    }, [onSort, sortBy]);

    useEffect(() => {
        onPaging(pageIndex);
    }, [onPaging, pageIndex]);

    useEffect(() => {
        onChange(globalFilter);
    }, [onChange, globalFilter]);

    return (
        <Card className={textSmall ? 'text-sm' : 'shadow'}>
            <CardHeader className={noPadding ? 'pl-0 pr-0 border-0' : 'border-0'}>
                {showAddBtn ? (showCard ? (<h3>{name ?? "DataTable"}</h3>) : '') : ''}
                <Row>

                    <Col className='col-md-5'>
                        {showAddBtn ? <DOMBtnAdd/> : (showCard ? (<h3>{name ?? "DataTable"}</h3>) : '')}
                    </Col>
                    {showFilter && (
                        <Col className="col-md-5 ml-md-auto">
                            <InputGroup
                                className={textSmall ? 'ml-md-auto input-group-sm input-group-alternative' : 'ml-md-auto input-group-alternative'}>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="fas fa-search"/>
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input onChange={_.debounce((e) => setGlobalFilter(e.target.value), 300)}
                                       placeholder="Search" type="text"
                                       className={textSmall ? 'form-control-sm form-control-alternative' : 'form-control-alternative'}/>
                            </InputGroup>
                        </Col>
                    )}
                </Row>
            </CardHeader>
            {
                !(data && data.length > 0)
                    ?
                    <NoDataFound />
                    :
                    (
                        <Table {...getTableProps()} className="align-items-center table-flush" responsive>
                            <thead className="thead-light">
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th scope='col' {...column.getHeaderProps(column.getSortByToggleProps())}>
                                            {column.render('Header')}
                                            <span>
                        {column.isSorted
                            ? column.isSortedDesc
                                ? ' 🔽'
                                : ' 🔼'
                            : ''}
                    </span>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                            {page.map((row, i) => {
                                prepareRow(row)
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map((cell, i) => {
                                            return i === 0 ?
                                                <th scope='row' {...cell.getCellProps()}>{cell.render('Cell')}</th> :
                                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        })}
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                    )
            }
            {
                data.length > 0
                    ? (
                        <CardFooter className={noPadding ? 'pl-0 pr-0 py-4' : 'py-4'}>
                            {showPageInfo && pageCount > 1 && (
                                <Label className="text-sm">
                                    Page {currentPage}/{pageCount}
                                </Label>
                            )}
                            {
                                pageCount > 1
                                &&
                                (
                                    <nav aria-label="...">
                                        <Pagination
                                            className="pagination justify-content-end mb-0"
                                            listClassName="justify-content-end mb-0">
                                            <PaginationItem className={!canPreviousPage ? "disabled" : ""}>
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        gotoPage(0)
                                                    }}
                                                    tabIndex="-1">
                                                    <i className="fas fa-angle-double-left"/>
                                                    <span className="sr-only">First</span>
                                                </PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem className={!canPreviousPage ? "disabled" : ""}>
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        previousPage()
                                                    }}>
                                                    <i className="fas fa-angle-left"/>
                                                    <span className="sr-only">Previous</span>
                                                </PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem className={!canNextPage ? "disabled" : ""}>
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        nextPage()
                                                    }}>
                                                    <i className="fas fa-angle-right"/>
                                                    <span className="sr-only">Next</span>
                                                </PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem className={!canNextPage ? "disabled" : ""}>
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        gotoPage(pageCount - 1)
                                                    }}>
                                                    <i className="fas fa-angle-double-right"/>
                                                    <span className="sr-only">Last</span>
                                                </PaginationLink>
                                            </PaginationItem>
                                        </Pagination>
                                    </nav>
                                )
                            }
                        </CardFooter>
                    )
                    :
                    ''
            }
        </Card>
    )
}
