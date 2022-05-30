import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  Textarea,
} from "@chakra-ui/react";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { BackButton } from "components/back-button";
import Head from "next/head";
import { useState } from "react";
import { useGlobalAlertDialog } from "hooks/use-global";

export default function Home() {
  const alertDialog = useGlobalAlertDialog();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        height: yup.string().required(),
        weight: yup.string().required(),
        v1: yup.string().required(),
        v2: yup.string().required(),
        v3: yup.string().required(),
      })
    ),
  });

  const onSubmit = (value) => {
    const { weight, height, v1, v2, v3 } = value;
    const calculated = {
      bmi: {
        value: weight / ((height / 100) * (height / 100)),
        message: "",
      },
      whr: {
        value: v2 / v3,
        message: "",
      },
    };

    if (calculated.bmi.value < 18.5) {
      console.log(calculated.bmi.value);
      calculated.bmi.message = "Cân nặng thấp (gầy)";
    } else if (calculated.bmi.value < 23) {
      calculated.bmi.message = "Bình thường";
    } else if (calculated.bmi.value < 25) {
      calculated.bmi.message = "Thừa cân, Tiền béo phì";
    } else if (calculated.bmi.value < 35) {
      calculated.bmi.message = "Thừa cân, Béo phì độ 1";
    } else if (calculated.bmi.value < 40) {
      calculated.bmi.message = "Thừa cân, Béo phì độ 2";
    } else {
      calculated.bmi.message = "Thừa cân, Béo phì độ 3";
    }

    if (calculated.whr.value < 0.95) {
      calculated.whr.message = "Bình thường";
    } else {
      calculated.whr.message =
        "Cao hơn bình thường, có nguy cơ bị bệnh tiểu đường, cao huyết áp, nhồi máu cơ tim...";
    }

    alertDialog({
      title: "Thông tin sức khỏe",
      message: (
        <>
          Chỉ số BMI: {calculated.bmi.value.toFixed(2)}
          <br />
          Kết luận:{" "}
          <Box as="strong" fontWeight="semibold">
            {calculated.bmi.message}
          </Box>
          <br />
          <br />
          Chỉ số WHR: {calculated.whr.value.toFixed(2)}
          <br />
          Kết luận:{" "}
          <Box as="strong" fontWeight={"semibold"}>
            {calculated.whr.message}
          </Box>
          <br />
        </>
      ),
    });
  };

  return (
    <>
      <Head>
        <title>Healthcare</title>
      </Head>

      <Flex
        as="form"
        direction="column"
        gap="4"
        maxW="xl"
        my="8"
        mx="auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <BackButton />
        </div>
        <Text align="center" fontSize="3xl" fontWeight="bold" mb="4">
          Thông tin về sức khỏe
        </Text>
        <FormControl isInvalid={errors.height}>
          <InputGroup>
            <InputLeftAddon w="28">Chiều cao *</InputLeftAddon>
            <Input
              type="number"
              placeholder="Ví dụ: 160"
              {...register("height")}
            />
          </InputGroup>
          {errors.height && (
            <FormErrorMessage>{errors.height?.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={errors.weight}>
          <InputGroup>
            <InputLeftAddon w="28">Cân nặng *</InputLeftAddon>
            <Input placeholder="Ví dụ: 55" {...register("weight")} />
          </InputGroup>
          {errors.weight && (
            <FormErrorMessage>{errors.weight?.message}</FormErrorMessage>
          )}
        </FormControl>

        <Box>
          <FormControl isInvalid={errors.history}>
            <Text fontSize="sm" fontWeight="semibold" mb="1">
              Lịch sử bệnh lý
            </Text>
            <Textarea
              placeholder="Nhập lịch sử bệnh lý của bạn để hệ thống có thể đưa ra đánh giá chính xác hơn"
              size="sm"
              {...register("history")}
            />
            {errors.history && (
              <FormErrorMessage>{errors.history?.message}</FormErrorMessage>
            )}
          </FormControl>
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="semibold" mb="1">
            Số đo 3 vòng (cm)
          </Text>
          <Flex gap="4">
            <FormControl isInvalid={errors.v1}>
              <InputGroup size="sm">
                <InputLeftAddon w="20">Vòng 1 *</InputLeftAddon>
                <Input placeholder="Vd. 90" {...register("v1")} />
              </InputGroup>
              {errors.v1 && (
                <FormErrorMessage>{errors.v1?.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={errors.v2}>
              <InputGroup size="sm">
                <InputLeftAddon w="20">Vòng 2 *</InputLeftAddon>
                <Input placeholder="Vd. 60" {...register("v2")} />
              </InputGroup>
              {errors.v2 && (
                <FormErrorMessage>{errors.v2?.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={errors.v3}>
              <InputGroup size="sm">
                <InputLeftAddon w="20">Vòng 3 *</InputLeftAddon>
                <Input placeholder="Vd. 90" {...register("v3")} />
              </InputGroup>
              {errors.v3 && (
                <FormErrorMessage>{errors.v3?.message}</FormErrorMessage>
              )}
            </FormControl>
          </Flex>
        </Box>

        <Button type="submit" colorScheme="teal" variant="solid">
          Gửi
        </Button>
      </Flex>
    </>
  );
}
