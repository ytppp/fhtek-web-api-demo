MIN_PNPM_VER_MAJOR=10
MIN_PNPM_VER_MINOR=4
MIN_PNPM_VER_PATCH=0

CUR_PNPM_VER := $(shell pnpm -v)
CUR_PNPM_VER_MAJOR := $(shell echo $(CUR_PNPM_VER) | cut -f1 -d.)
CUR_PNPM_VER_MINOR := $(shell echo $(CUR_PNPM_VER) | cut -f2 -d.)
CUR_PNPM_VER_PATCH := $(shell echo $(CUR_PNPM_VER) | cut -f3 -d.)
IS_PNPM_OK := $(shell [ $(CUR_PNPM_VER_MAJOR) -gt $(MIN_PNPM_VER_MAJOR) -o \( $(CUR_PNPM_VER_MAJOR) -eq $(MIN_PNPM_VER_MAJOR) -a \( $(CUR_PNPM_VER_MINOR) -gt $(MIN_PNPM_VER_MINOR) -o \( $(CUR_PNPM_VER_MINOR) -eq $(MIN_PNPM_VER_MINOR) -a $(CUR_PNPM_VER_PATCH) -ge $(MIN_PNPM_VER_PATCH) \)  \) \) ] && echo true)

CUSTOMER_LIST = demo fhtek

ifndef CUSTOMER_ID
$(error CUSTOMER_ID required)
endif

ifeq ($(shell echo $(CUSTOMER_LIST) | grep $(CUSTOMER_ID)),)
$(error CUSTOMER_ID should be oneof ($(CUSTOMER_LIST)))
endif

all: install

install:
	make build

check_pnpm_version:
ifneq ($(IS_PNPM_OK),true)
	$(error pnpm-v$(MIN_PNPM_VER_MAJOR).$(MIN_PNPM_VER_MINOR).$(MIN_PNPM_VER_PATCH)+ required)
endif

depend: package.json pnpm-lock.yaml check_pnpm_version
	pnpm install

build: depend
	@CUSTOMER_ID=$(CUSTOMER_ID) pnpm build-only

dev: depend
	@CUSTOMER_ID=$(CUSTOMER_ID) pnpm dev

.PHONY: all install check_pnpm_version depend dev build
