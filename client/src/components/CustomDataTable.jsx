import React, { useState, useMemo } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Paper,
  TextField,
  InputAdornment,
  Typography,
  Box,
} from "@mui/material";

import { FaSearch } from "react-icons/fa";

const CustomDataTable = ({ columns, data, tableTitle }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 🔍 Search filter
  const filteredData = useMemo(() => {
    return data?.filter((row) =>
      columns.some((col) =>
        String(row[col.accessor]).toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, data, columns]);

  // 📄 Pagination slice
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredData?.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        padding: 2,
      }}
    >
      {/* 🔍 Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        gap={2}
      >
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* 📊 Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              {columns?.map((col, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData?.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex} hover sx={{ transition: "0.2s" }}>
                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={colIndex}
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        //  maxWidth: 150,
                      }}
                    >
                      {col.render
                        ? col.render(row[col.accessor], row)
                        : row[col.accessor]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns?.length} align="center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 🔢 Pagination */}
      <TablePagination
        component="div"
        count={filteredData?.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 15, 20, 25]}
      />
    </Paper>
  );
};

export default CustomDataTable;
