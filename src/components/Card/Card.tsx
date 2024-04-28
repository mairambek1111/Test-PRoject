import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import "./Card.scss";
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  popularity: number;
  poster_path: string;
  overview: string;
}

function Card() {
  const [data, setData] = useState([]);
  const [open, setopen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    axios
      .get(
        "https://api.themoviedb.org/3/movie/popular?api_key=45d1d56fc54beedb6c0207f9ac6cab7c&language=en-US&page=1"
      )
      .then((res) => {
        setData(
          res.data.results.map((el: Movie, index: number) => ({
            id: index + 1,
            title: el.title,
            overview: el.overview,
            release_date: el.release_date,
            popularity: `${Math.round(el.popularity) / 100}`,
            poster_path: `https://image.tmdb.org/t/p/w500/${el.poster_path}`,
          }))
        );
        console.log(res.data.results);
      });
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "id", width: 70 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "release_date", headerName: "Release Date", width: 150 },
    { field: "popularity", headerName: "popularity", width: 150 },
    {
      field: "image",
      headerName: "image",
      width: 100,
      renderCell: (params) => {
        return (
          <img
            src={params.row.poster_path}
            alt="Poster"
            style={{ width: 100 }}
          />
        );
      },
    },
  ];

  function handleClickopen(movie: Movie) {
    setSelectedMovie(movie);
    setopen(true);
  }
  function handleClose() {
    setopen(false);
  }

  return (
    <>
      <div className="container">
        <DataGrid
          rows={data}
          style={{ height: "300px", width: "100%", cursor: "pointer" }}
          columns={columns}
          onRowClick={(params) => handleClickopen(params.row as Movie)}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </div>

      <Dialog
        style={{ cursor: "pointer" }}
        open={open}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>{selectedMovie?.title}</DialogTitle>
        <DialogContent>
          <img
            src={selectedMovie?.poster_path}
            style={{ width: "100%" }}
            alt=""
          />
        </DialogContent>
        <DialogTitle>{selectedMovie?.overview}</DialogTitle>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Card;
