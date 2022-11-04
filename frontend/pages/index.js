import { Button, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import * as yup from "yup";

export default function Home() {
  let schema = yup.object().shape({
    name: yup.string().required(),
    surname: yup.string().required(),
    phone: yup.number(),
    editId: yup.number(),
  });
  const [name, setName] = useState("");
  const [surname, setSurName] = useState("");
  const [phone, setPhone] = useState(0);
  const [people, setPeople] = useState([]);
  const [editId, setEditId] = useState(-1);

  const setEditPerson = (editPerson) => {
    setName(editPerson.name);
    setSurName(editPerson.surname);
    setPhone(editPerson.phone_number);
    setEditId(editPerson.id);
  };
  const personUpdate = () => {
    if (editId === -1) {
      alert("Değiştirmek istediğinizi seçin");
      return;
    }
    const editPerson = {
      name: name,
      surname: surname,
      phone_number: phone,
      id: editId,
    };
    schema.isValid(editPerson).then(function (valid) {
      if (valid === true) {
        axios
          .post("http://127.0.0.1:8080/person/update", editPerson)
          .then((res) => {
            if (res.status === 200) {
              alert("Düzenleme Başarılı");
              console.log(res);
              const newPerson = people.map((person) => {
                if (person.id === res.data.changePerson.id) {
                  person.name = res.data.changePerson.name;
                  person.surname = res.data.changePerson.surname;
                  person.phone_number = res.data.changePerson.phone_number;
                }
                return person;
              });
              setPeople(newPerson);
            }
          })
          .catch((err) => {
            alert(err.response.data.err);
          });
      } else {
        alert("zorunlu alanları doldur");
      }
    });
  };

  const Saved = () => {
    console.log(name);
    const person = { name: name, surname: surname, phone_number: phone };
    console.log(person);

    axios.post("http://127.0.0.1:8080/directory/create", person).then((res) => {
      console.log(res);
      if (res.status === 200) {
        alert("Kişi eklendi");

        setName("");
        setSurName("");
        setPhone("");
      }
    });
  };
  useEffect(() => {
    axios.get("http://127.0.0.1:8080/person").then((res) => {
      setPeople(res.data.person);
      console.log(people);
    });
  }, []);

  return (
    <Grid container p={5}>
      <Grid item md={4}></Grid>
      <Grid item md={6}>
        <Grid container>
          <h3>Directory App</h3>
          <Grid container>
            <Grid item md={2} mt={1}>
              Name:
            </Grid>
            <Grid item md={6}>
              <TextField
                id="outlined-basicc"
                label="Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container mt={2}>
            <Grid item md={2} mt={1}>
              Surname:
            </Grid>
            <Grid item md={6}>
              <TextField
                id="outlined-basic"
                label="Surname"
                variant="outlined"
                value={surname}
                onChange={(e) => setSurName(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container mt={2}>
            <Grid item md={2} mt={1}>
              Phone Number:
            </Grid>
            <Grid item md={6}>
              <TextField
                id="outlined-number"
                label="Number"
                type="number"
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container p={3}>
            <Grid item md={5}></Grid>
            <Grid item md={6}>
              <Button onClick={Saved} color="primary" variant="contained">
                Save
              </Button>
              <Button
                onClick={personUpdate}
                color="primary"
                variant="contained"
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={3}></Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Surname</TableCell>
              <TableCell align="right">Phone Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {people.map((person) => (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">{person.name}</TableCell>
                <TableCell align="right">{person.surname}</TableCell>
                <TableCell align="right">{person.phone_number}</TableCell>
                <Button
                  onClick={() => {
                    setEditPerson(person);
                  }}
                  color="primary"
                  variant="contained"
                >
                  Edit
                </Button>
                {/* <Button color="error" variant="contained">
                  Delete
                </Button> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
