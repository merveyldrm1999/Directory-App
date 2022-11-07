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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const personSchema = yup.object().shape({
  name: yup.string("Geçersiz Değer Girdin").required("zorunlu alanları doldur"),
  surname: yup
    .string("Geçersiz Değer Girdin")
    .required("zorunlu alanları doldur"),
  phone: yup
    .number()
    .min(11, "En az 11 rakan giriniz")
    .required("zorunlu alanları doldur"),
});

export default function Home() {
  const [defaultValues, setDefaultValues] = useState({
    name: "",
    surname: "",
    phone: "",
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(personSchema), defaultValues });

  const [people, setPeople] = useState([]);
  const [editId, setEditId] = useState(-1);
  const [updateOrCreate, setUpdateOrCreate] = useState(true);

  const editPerson = (editPerson) => {
    setDefaultValues(editPerson);
    // setValue("name", editPerson.name)
    setEditId(editPerson.id);
    setUpdateOrCreate(false);
  };
  const onError = (errors) => {
    alert("Hatalı yerleri düzeltin");
  };
  const personUpdate = () => {
    if (editId === -1) {
      alert("Değiştirmek istediğinizi seçin");
      return;
    }
    const editPerson = defaultValues;
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
  };
  const newSave = () => {
    setUpdateOrCreate(true);
  };
  const Saved = (data) => {
    const person = {
      name: data.name,
      surname: data.surname,
      phone_number: data.phone,
    };
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

  const personDelete = (id) => {
    axios
      .delete("http://127.0.0.1:8080/person/delete/" + id)
      .then((res) => {
        if (res.status === 200) {
          alert("Silme Başarılı");
          const personn = people.filter((per) => {
            if (per.id !== id) {
              return per;
            }
          });
          setPeople(personn);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Grid container p={5}>
      <Grid item md={4}>
        {updateOrCreate == true ? (
          ""
        ) : (
          <Button onClick={newSave} color="primary" variant="contained">
            Yeni Kayıt Ekle
          </Button>
        )}
      </Grid>
      <Grid item md={6}>
        <form onSubmit={handleSubmit((data) => Saved(data), onError)}>
          <Grid container>
            <h3>Directory App</h3>

            <Grid container>
              <Grid item md={2} mt={1}>
                Name:
              </Grid>
              <Grid item md={6}>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value, ref } }) => (
                    <TextField
                      id="outlined-basicc"
                      label="Name"
                      variant="outlined"
                      value={value.name}
                      onChange={onChange}
                    />
                  )}
                />
                {errors.name && <p>{errors.name.message}</p>}
              </Grid>
            </Grid>
            <Grid container mt={2}>
              <Grid item md={2} mt={1}>
                Surname:
              </Grid>
              <Grid item md={6}>
                <Controller
                  control={control}
                  name="surname"
                  render={({ field: { onChange, value, ref } }) => (
                    <TextField
                      id="outlined-basic"
                      label="Surname"
                      variant="outlined"
                      value={value.surname}
                      onChange={onChange}
                    />
                  )}
                />
                {errors.surname && <p>{errors.surname.message}</p>}
              </Grid>
            </Grid>
            <Grid container mt={2}>
              <Grid item md={2} mt={1}>
                Phone Number:
              </Grid>
              <Grid item md={6}>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, value, ref } }) => (
                    <TextField
                      id="outlined-number"
                      label="Number"
                      type="number"
                      variant="outlined"
                      value={value.phone}
                      onChange={onChange}
                    />
                  )}
                />
                {errors.phone && <p>{errors.phone.message}</p>}
              </Grid>
            </Grid>
            <Grid container p={3}>
              <Grid item md={5}></Grid>
              <Grid item md={6}>
                {updateOrCreate === true ? (
                  <Button type="submit" color="primary" variant="contained">
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={personUpdate}
                    color="success"
                    variant="contained"
                  >
                    Update
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
        </form>
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
              <TableRow>
                <TableCell align="right">{person.name}</TableCell>
                <TableCell align="right">{person.surname}</TableCell>
                <TableCell align="right">{person.phone_number}</TableCell>
                <Button
                  onClick={() => {
                    editPerson(person);
                  }}
                  color="primary"
                  variant="contained"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => personDelete(person.id)}
                  color="error"
                  variant="contained"
                >
                  Delete
                </Button>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
