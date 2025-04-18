import MintButton from "@/components/ui/mint-button";
import useBuyNft from "@/hooks/useBuyNft";
import type { TokenItem } from "@/lib/types";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Flex,
  Text,
  Link,
  Box,
  Grid,
  GridItem,
  Spinner
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import FullSizeImageModal from "@/components/common/image-modal";
import {
  psycNFTCopiesMainnet,
  psycNFTCopiesSepolia,
  psyNFTMainnet,
  psyNFTSepolia
} from "@/constants/contracts";
import { useCustomToasts } from "@/hooks/useCustomToasts";
import { useResize } from "@/hooks/useResize";
import useToggleCopySales from "@/hooks/useToggleCopySales";
import useReadTokenInformation from "@/hooks/useReadTokenInformation";
import { env } from "@/config/env.mjs";

interface OwnedNftItemProps {
  item: Omit<TokenItem, "batchId" | "price"> & {
    whitelist: string[];
    balance?: string;
  };
  index: number;
  isPrivateSale: boolean;
  isOriginal: boolean;
  isOwnedView?: boolean;
  refetchBalances: () => void;
  triggerReload: () => void;
}

const OwnedNftItem = (props: OwnedNftItemProps) => {
  const contractAddress = env.NEXT_PUBLIC_IS_MAINNET
    ? props.isOriginal
      ? psyNFTMainnet
      : psycNFTCopiesMainnet
    : props.isOriginal
      ? psyNFTSepolia
      : psycNFTCopiesSepolia;

  const baseURL = env.NEXT_PUBLIC_IS_MAINNET
    ? env.NEXT_PUBLIC_MAINNET_ETHERSCAN_BASE_URL
    : env.NEXT_PUBLIC_SEPOLIA_ETHERSCAN_BASE_URL;
  const tokenURL = `${baseURL}/${contractAddress}/${props.item.tokenId}`;

  const { buyNft, isPending, isConfirming, isMinting } = useBuyNft(
    props.isPrivateSale,
    false,
    props.isOriginal,
    props.refetchBalances
  );

  const isButtonDisabled =
    isPending ||
    isConfirming ||
    isMinting ||
    props.isOriginal ||
    props.isPrivateSale;

  const { showCustomErrorToast } = useCustomToasts();
  const { width } = useResize();
  const { tokenInformationData } = useReadTokenInformation(props.item.tokenId);
  const [isActive, setIsActive] = useState<boolean>();

  const fetchSaleStatus = useCallback(() => {
    if (tokenInformationData) {
      setIsActive(tokenInformationData[2]);
    }
  }, [tokenInformationData, setIsActive]);

  useEffect(() => {
    fetchSaleStatus();
  }, [fetchSaleStatus]);

  const { toggleSaleStatus, isPending: isLoading } = useToggleCopySales({
    refetchSaleStatus: () => {
      fetchSaleStatus();
      props.triggerReload();
    }
  });

  const handleToggleSaleStatus = async () => {
    try {
      if (props.isOriginal && props.item.tokenId) {
        await toggleSaleStatus([parseInt(props.item.tokenId)]);
      } else {
        console.error("Sale status toggle failed");
        showCustomErrorToast("Failed to toggle sale status", width);
      }
    } catch (error) {
      const message = (error as Error).message || "An error occurred";
      showCustomErrorToast(message, width);
    }
  };

  const [isImageOpen, setIsImageOpen] = useState(false);

  return (
    <Flex
      px={4}
      py={2}
      borderRadius={"21px"}
      border="1px solid #E9BDBD"
      w={"100%"}
      h={"100%"}
      direction={"column"}
      gap={2}
    >
      <Flex w={"100%"} justifyContent={"space-between"} alignItems={"center"}>
        <Text
          fontFamily={"Inter"}
          fontSize={16}
          fontWeight={500}
          color={"#585858"}
        >
          {`NFT ${props.item.tokenId}`}
        </Text>
        <Flex
          borderRadius={"30px"}
          border={"1px solid #EB7A7A73"}
          padding={"5px 16px 5px 8px"}
          gap={2.5}
        >
          <Image
            src="/icons/etherscan-icon.svg"
            alt="etherscan icon"
            height={24}
            width={24}
          />
          <Link href={tokenURL} isExternal>
            <ExternalLinkIcon color={"#DA7C7C"} h={"12px"} w={"12px"} />
          </Link>
        </Flex>
      </Flex>
      <Box
        w="100%"
        h={"208px"}
        borderRadius={"20px"}
        overflow="hidden"
        position="relative"
        border="1px solid #e2e2e2"
        boxShadow="md"
        onClick={() => setIsImageOpen((prev) => !prev)}
        cursor={"pointer"}
      >
        <Image
          src={props.item.src}
          alt={`PSYC ${props.index + 1}`}
          fill
          objectFit="cover"
        />
      </Box>
      <FullSizeImageModal
        isOpen={isImageOpen}
        imageSrc={props.item.src}
        onClose={() => {
          setIsImageOpen((prev) => !prev);
        }}
      />
    </Flex>
  );
};

export default OwnedNftItem;
