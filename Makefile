build:
	cd packages/server && $(MAKE) build
	cd packages/client && $(MAKE) build

run:
	docker-compose up

stop:
	docker-compose down 