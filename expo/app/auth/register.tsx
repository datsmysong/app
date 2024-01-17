import { useForm } from "react-hook-form";
import { Text } from "react-native-elements";
type FormData = {
  email: string;
  password: string;
};

export default function Register() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = ({ email, password }: FormData) => {};

  return <Text>register</Text>;
}
