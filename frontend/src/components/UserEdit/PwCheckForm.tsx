import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Input from "../common/Input";
import Button from "../common/Button";
import Spacer from "../common/Spacer";
import FormHeader from "../layout/FormHeader";

const INPUT_MARGIN_BOTTOM = 2;

function PwCheckForm() {
  const [form, setForm] = useState({
    userPw: "",
  });
  const [isEmpty, setEmpty] = useState(true);
  const navigate = useNavigate();
  const { userPw } = form;
  const Submit = () => {
    console.log(form.userPw);
    axios
      .post("/user/check-pw", form)
      .then(() => {
        navigate("/inquire");
      })
      .catch((error) => {
        alert("비밀번호가 틀렸습니다.");
      });
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  useEffect(() => {
    if (userPw === "") {
      setEmpty(true);
    } else {
      setEmpty(false);
    }
  });

  return (
    <div>
      <Spacer size={INPUT_MARGIN_BOTTOM} />
      <FormHeader text="Check Pw" />
      <Spacer size={INPUT_MARGIN_BOTTOM} />
      <Input
        name="userPw"
        placeHolder="Password check"
        value={form.userPw}
        onChange={onChange}
      />
      <Button
        buttonType="button"
        text="submit"
        handleClick={Submit}
        Disabled={isEmpty}
      />
    </div>
  );
}

export default PwCheckForm;
