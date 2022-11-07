import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
//Aşağıdaki controllerler için zorunlulukları belirliyoruz.
const personSchema = yup.object().shape({
  //name zorunlu olacak ve string olacak
  name: yup.string("Geçersiz Değer Girdin").required("zorunlu alanları doldur"),
  //surname zorunlu oalcak ve string olacak
  surname: yup
    .string("Geçersiz Değer Girdin")
    .required("zorunlu alanları doldur"),
});

export default function Home() {
  //Önce use form tanımlıyorum ve bu use form için person ismini belirliyorum. use form içinde de yup validation kullancamı söylüyorum.
  //yup kullanıcam bu da yukarda belirlediğim kurallar gerçerliliğinde personSchema kuralları
  const {
    person,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(personSchema) });

  //eğer yup validationu geöersem bu fonksiyon calıscak cunku form submit de ilk bu funk var.
  const test = (data) => {
    console.log(data);
  };
  //eğer validate i geçemezsen bu calısıt cünkü on submit 2. funk. bu var ve 2. yazılan error demek
  const onError = (errors) => {
    alert("KArdeşim önce git hatalı yerleri düzelt");

    console.log(errors);
  };

  return (
    <>
      {/* Submit olduğunda calıscak fonskyionları yardımcı submit fonksiyonu ile belirliyorum. İlk fonskyion validateleri gecersem ikinci ise gecemezsesn calısırş */}
      <form onSubmit={handleSubmit((data) => test(data), onError)}>
        {/* Burada form için almam gereken bilgileri alıyorum controller bu bilginin adını tasır burada name bunun bilgisi dir  */}
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            //alınacak bilginin form tipi burada inputtur.
            <TextField onChange={onChange} />
          )}
        />
        {/* alınan bilginin hata mesajı */}
        {errors.name && <p>{errors.name.message}</p>}
        {/* //yeni bir bilgi yukarıdaki ile aynı sekilde bu bilgi de surname dir */}
        <Controller
          control={control}
          name="surname"
          ref={person}
          render={({ field: { onChange, value } }) => (
            <TextField onChange={onChange} />
          )}
        />
        {errors.surname && <p>{errors.surname.message}</p>}

        <button type="submit">Gönder</button>
      </form>
    </>
  );
}
